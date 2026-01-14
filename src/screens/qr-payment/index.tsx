import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { KeyIcon } from 'src/assets/key-icon'
import { BaseSheet } from 'src/components/base-sheet'
import { Button } from 'src/components/button'
import { QRCodeScanner } from 'src/components/qr-code-scanner'
import { useCard } from 'src/contexts/use-card'
import { cardsServices } from 'src/services/cards/endpoints'
import { ResponseSellByQrCodeDto } from 'src/services/cards/responses-dto'
import BodyPayQrCodeDto from 'src/services/cards/validations/body-pay-qr-code.dto'
import { colors } from 'src/theme/colors'
import { formatNumberToCurrency } from 'src/utils'

interface QrPaymentProps {
  onGoBack: () => void
}

interface ScannedQrData {
  saleId: string
  amount: number
  description: string
  installments: number
  shopId: string
  shopName: string
  expiresIn: number
}

interface PaymentFormData {
  password: string
}

export function QrPayment({ onGoBack }: QrPaymentProps) {
  const [scannedData, setScannedData] = useState<ScannedQrData | null>(null)
  const [activeSaleId, setActiveSaleId] = useState<string | null>(null)
  const [saleDetails, setSaleDetails] =
    useState<ResponseSellByQrCodeDto | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [cardPassword, setCardPassword] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const expirationInterval = useRef<NodeJS.Timeout | null>(null)
  const currentSaleId = useRef<string | null>(null)

  const { selectedCard, isCardAuthenticated } = useCard()

  const startExpirationTimer = (expiresInSeconds: number) => {
    setTimeLeft(expiresInSeconds)
    setIsExpired(false)

    expirationInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setIsExpired(true)
          clearExpirationTimer()
          Alert.alert(
            'QR Code Expirado',
            'Este QR Code expirou. Por favor, solicite um novo QR Code para o pagamento.',
            [{ text: 'OK', onPress: handleCloseModal }]
          )
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const clearExpirationTimer = () => {
    if (expirationInterval.current) {
      clearInterval(expirationInterval.current)
      expirationInterval.current = null
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      clearPolling()
      clearExpirationTimer()
    }
  }, [])

  const handleQRCodeScanned = async (data: string) => {
    if (isLoadingDetails || scannedData || showPaymentModal) return

    setIsLoadingDetails(true)

    try {
      let saleId: string
      let parsedData: ScannedQrData | null = null

      // Tenta fazer parse como JSON (formato do app)
      try {
        const jsonData = JSON.parse(data)

        if (jsonData.saleId) {
          // É um JSON válido com saleId - formato do app
          parsedData = jsonData
          saleId = jsonData.saleId

          // Verifica expiração apenas se vier do app (que tem essa informação)
          if (parsedData?.expiresIn && parsedData.expiresIn <= Date.now()) {
            setIsLoadingDetails(false)
            Alert.alert(
              'QR Code Expirado',
              'Este QR Code já expirou. Solicite um novo QR Code ao estabelecimento e tente novamente.',
              [{ text: 'Entendi', onPress: onGoBack }]
            )
            return
          }
        } else {
          throw new Error('JSON sem saleId')
        }
      } catch (jsonError) {
        // Não é JSON válido, trata como saleId direto (formato web)
        saleId = data.trim()
      }

      if (!saleId) {
        setIsLoadingDetails(false)
        Alert.alert(
          'QR Code Inválido',
          'Não foi possível ler este QR Code. Verifique se ele está correto e tente novamente.',
          [{ text: 'Tentar Novamente', onPress: onGoBack }]
        )
        return
      }

      // Salva o saleId sempre e os dados completos apenas se vier do app
      setActiveSaleId(saleId)
      setScannedData(parsedData)
      await fetchSaleDetails(saleId)
    } catch (error) {
      setIsLoadingDetails(false)

      let alertTitle = 'Erro na Leitura'
      let alertMessage = 'Ocorreu um erro inesperado. Tente novamente.'

      if (error instanceof SyntaxError) {
        alertTitle = 'QR Code Inválido'
        alertMessage =
          'O QR Code lido não possui um formato válido. Verifique se é um QR Code de pagamento válido e tente novamente.'
      } else if (error instanceof Error) {
        // Log detalhado do erro para debug
        console.error('Erro ao processar QR Code:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          qrData: data,
        })

        if (
          error.message.includes('network') ||
          error.message.includes('fetch')
        ) {
          alertTitle = 'Erro de Conexão'
          alertMessage =
            'Problema de conectividade. Verifique sua internet e tente novamente.'
        } else if (error.message.includes('timeout')) {
          alertTitle = 'Tempo Esgotado'
          alertMessage =
            'A operação demorou muito para responder. Tente novamente.'
        } else {
          alertMessage =
            'Não foi possível processar o QR Code. Verifique se a imagem está nítida e tente novamente.'
        }
      } else {
        // Erro desconhecido
        console.error('Erro desconhecido ao processar QR Code:', error)
      }

      Alert.alert(alertTitle, alertMessage, [
        { text: 'Tentar Novamente', onPress: onGoBack },
      ])
    }
  }

  const fetchSaleDetails = async (saleId: string) => {
    setIsLoadingDetails(true)
    try {
      const details = await cardsServices.getDetailsQrCode(saleId)
      setSaleDetails(details)

      if (scannedData?.expiresIn) {
        startExpirationTimer(scannedData.expiresIn)
      }

      setShowPaymentModal(true)
    } catch (error) {
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível carregar os detalhes da compra. Verifique sua conexão e tente novamente.',
        [{ text: 'Tentar Novamente', onPress: onGoBack }]
      )
      console.error('Erro ao buscar detalhes da venda:', error)
      setScannedData(null)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const startPaymentPolling = (saleId: string) => {
    currentSaleId.current = saleId

    pollingInterval.current = setInterval(async () => {
      try {
        await cardsServices.getDetailsQrCode(saleId)
      } catch (error: any) {
        if (
          error?.status === 404 ||
          error?.status === 403 ||
          error?.details?.statusCode === 404 ||
          error?.details?.statusCode === 403
        ) {
          clearPolling()
          handlePaymentSuccess()
        }
      }
    }, 3000)
  }

  const clearPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
      pollingInterval.current = null
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)

    Alert.alert(
      'Pagamento Confirmado!',
      'Seu pagamento foi processado com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => {
            setPaymentSuccess(false)
            handleCloseModal()
          },
        },
      ]
    )
  }

  const handleConfirmPayment = async () => {
    if (!selectedCard) {
      Alert.alert(
        'Cartão Necessário',
        'Por favor, selecione um cartão para continuar com o pagamento.',
        [{ text: 'OK' }]
      )
      return
    }

    if (!activeSaleId) {
      Alert.alert(
        'Erro',
        'Informações da venda não encontradas. Tente escanear o QR Code novamente.',
        [{ text: 'OK', onPress: onGoBack }]
      )
      return
    }

    if (isExpired) {
      Alert.alert(
        'QR Code Expirado',
        'Este QR Code já expirou. Solicite um novo QR Code ao estabelecimento.',
        [{ text: 'Entendi', onPress: handleCloseModal }]
      )
      return
    }

    if (!cardPassword || cardPassword.length !== 4) {
      Alert.alert(
        'Senha Necessária',
        'Por favor, digite a senha de 4 dígitos do seu cartão para continuar.',
        [{ text: 'OK' }]
      )
      return
    }

    setIsProcessingPayment(true)

    try {
      const paymentData: BodyPayQrCodeDto = {
        cardId: selectedCard.id,
        password: cardPassword,
      }

      const result = await cardsServices.payQrCode(activeSaleId, paymentData)

      setIsProcessingPayment(false)

      handlePaymentSuccess()
    } catch (error) {
      Alert.alert(
        'Erro no Pagamento',
        'Não foi possível processar o pagamento. Verifique sua senha e tente novamente.',
        [{ text: 'Tentar Novamente' }]
      )
      console.error('Erro no pagamento:', error)
      setIsProcessingPayment(false)
    }
  }

  const handleCloseModal = () => {
    clearPolling()
    clearExpirationTimer()
    setShowPaymentModal(false)
    setScannedData(null)
    setActiveSaleId(null)
    setSaleDetails(null)
    setCardPassword('')
    setPaymentSuccess(false)
    setTimeLeft(null)
    setIsExpired(false)
    currentSaleId.current = null
    onGoBack()
  }

  const handleCancelPayment = () => {
    clearPolling()
    clearExpirationTimer()
    setShowPaymentModal(false)
    setScannedData(null)
    setActiveSaleId(null)
    setSaleDetails(null)
    setCardPassword('')
    setPaymentSuccess(false)
    setTimeLeft(null)
    setIsExpired(false)
    currentSaleId.current = null
  }

  return (
    <View style={styles.container}>
      {/* Camera Background */}
      <QRCodeScanner onClose={onGoBack} onQRCodeScanned={handleQRCodeScanned} />

      {/* Loading Overlay */}
      {isLoadingDetails && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              Carregando detalhes da venda...
            </Text>
          </View>
        </View>
      )}

      {/* Payment Bottom Sheet */}
      <BaseSheet
        visible={showPaymentModal}
        title="Confirmar Pagamento"
        onClose={handleCancelPayment}
        footer={
          saleDetails ? (
            <View style={styles.buttonContainer}>
              <Button
                variant="outline"
                onPress={handleCancelPayment}
                style={styles.cancelButton}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleConfirmPayment}
                disabled={
                  isProcessingPayment || cardPassword.length !== 4 || isExpired
                }
                loading={isProcessingPayment}
                style={styles.confirmButton}
              >
                {isExpired
                  ? 'QR Code Expirado'
                  : isProcessingPayment
                  ? 'Aguardando confirmação...'
                  : 'Confirmar Compra'}
              </Button>
            </View>
          ) : null
        }
      >
        {saleDetails ? (
          <View style={styles.sheetContent}>
            {/* Store info */}
            <View style={styles.storeCard}>
              <Text style={styles.storeTitle}>
                {saleDetails.shop?.name || 'Nome não disponível'}
              </Text>
              <Text style={styles.storeSubtitle}>
                CNPJ: {saleDetails.shop?.cnpj || 'CNPJ não disponível'}
              </Text>
            </View>

            {/* Purchase details */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Detalhes da Compra</Text>

              {/* Timer de expiração */}
              {timeLeft !== null && (
                <View style={[styles.detailRow, { marginBottom: 16 }]}>
                  <Text style={styles.detailLabel}>Tempo restante:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: timeLeft < 60 ? '#ef4444' : colors.primary,
                        fontWeight: 'bold',
                      },
                    ]}
                  >
                    {formatTime(timeLeft)}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Descrição:</Text>
                <Text style={styles.detailValue}>
                  {saleDetails.description || 'Descrição não disponível'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Valor Total:</Text>
                <Text style={styles.detailValueAmount}>
                  {formatNumberToCurrency(saleDetails.amount || 0)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Parcelas:</Text>
                <Text style={styles.detailValue}>
                  {saleDetails.installments || 1}x de{' '}
                  {formatNumberToCurrency(saleDetails.valueInstallment || 0)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Vendedor:</Text>
                <Text style={styles.detailValue}>
                  {saleDetails.seller?.name || 'Vendedor não disponível'}
                </Text>
              </View>
            </View>

            {/* Card info - Always show even if no selectedCard */}
            <View style={styles.cardInfoCard}>
              <Text style={styles.cardTitle}>Cartão para Pagamento</Text>
              {selectedCard ? (
                <>
                  <Text style={styles.cardNumber}>
                    {selectedCard.cardNumber}
                  </Text>
                  <Text style={styles.cardOwner}>
                    {selectedCard.cardholderName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardNumber}>
                    Nenhum cartão selecionado
                  </Text>
                  <Text style={styles.cardOwner}>
                    Selecione um cartão nas configurações
                  </Text>
                </>
              )}
            </View>

            {/* Password input */}
            <View style={styles.passwordContainer}>
              <Text style={styles.passwordLabel}>
                Senha do Cartão (4 dígitos)
              </Text>
              <View style={styles.passwordInputContainer}>
                <KeyIcon width={20} height={20} color={colors.gray[400]} />
                <TextInput
                  style={styles.passwordInput}
                  value={cardPassword}
                  onChangeText={setCardPassword}
                  placeholder="Digite sua senha"
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={4}
                  placeholderTextColor={colors.gray[400]}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.sheetContent}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.gray[500],
                fontSize: 16,
              }}
            >
              Carregando dados da venda...
            </Text>
          </View>
        )}
      </BaseSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.gray[600],
    fontSize: 16,
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  qrIconContainer: {
    marginBottom: 32,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: 12,
    textAlign: 'center',
  },
  scanSubtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: 4,
  },
  storeSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.gray[600],
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: colors.gray[800],
    flex: 1,
    textAlign: 'right',
  },
  detailValueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    textAlign: 'right',
  },
  cardInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: 4,
  },
  cardOwner: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 8,
  },
  cardAuth: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  paymentButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  paymentButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sheetContent: {
    flex: 1,
  },

  passwordContainer: {
    marginVertical: 20,
  },
  passwordLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  passwordInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.gray[900],
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    maxHeight: 40,
    flex: 1,
  },
  confirmButton: {
    flex: 2,
    maxHeight: 40,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})

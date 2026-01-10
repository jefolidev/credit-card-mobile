import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { ArrowLeftIcon } from 'src/assets/arrow-left'
import { DocumentIcon } from 'src/assets/document-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import { QrCodeIcon } from 'src/assets/qr-code-icon'
import { SellProcessingModal } from 'src/components/sell-processing-modal'
import { useSells } from 'src/contexts/use-sells'
import { getQrCodeSell, getSells } from 'src/services/sells/endpoints'
import { CreateQrCodeSellDto } from 'src/services/sells/validations/create-qr-code-sell.dto'
import { colors } from 'src/theme/colors'
import {
  calculateInstallmentValue,
  formatCurrency,
  parseCurrencyToNumber,
} from 'src/utils'

interface QrCodeSaleProps {
  onGoBack: () => void
  onConfirmSale: (saleData: CreateQrCodeSellDto) => void
}

interface QrSaleData {
  description: string
  value: number
  installments: number
}

interface SaleFormData {
  description: string
  saleValue: string
  installments: number
}

export function QrCodeSale({ onGoBack, onConfirmSale }: QrCodeSaleProps) {
  const [showQrCode, setShowQrCode] = useState(false)
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null)
  const [paymentProcessingState, setPaymentProcessingState] = useState<
    'idle' | 'waiting' | 'paid' | 'error'
  >('idle')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const expirationInterval = useRef<NodeJS.Timeout | null>(null)

  const { createQrCode } = useSells()

  const form = useForm<SaleFormData>({
    defaultValues: {
      description: '',
      saleValue: '',
      installments: 1,
    },
  })

  const currentSaleValue = parseCurrencyToNumber(form.watch('saleValue'))
  const currentInstallments = form.watch('installments')
  const currentDescription = form.watch('description')

  const isFormValid =
    currentDescription.trim().length > 0 && currentSaleValue > 0
  const installmentValue = calculateInstallmentValue(
    currentSaleValue,
    currentInstallments
  )

  // Funções do timer de expiração
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
            'O QR Code expirou. Será gerado um novo QR Code.',
            [{ text: 'OK', onPress: handleGoBackToDashboard }]
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

  // Polling para verificar pagamento
  const startPolling = (saleId: string) => {
    setCurrentSaleId(saleId)
    setPaymentProcessingState('waiting')

    pollingInterval.current = setInterval(async () => {
      try {
        // Primeiro tenta buscar usando getSells (método que funcionava)
        const sellsResponse = await getSells({})
        const currentSale = sellsResponse.sells.find(
          (sell: any) => sell.id === saleId
        )

        // Se não encontrou nas vendas normais, tenta buscar nos QR codes
        if (!currentSale) {
          try {
            const qrCodes = await getQrCodeSell()
            const currentQr = qrCodes.find((qr) => qr.id.toString() === saleId)

            if (currentQr) {
              // QR code ainda existe mas não foi pago ainda
              console.log('QR code ainda ativo, aguardando pagamento...')
              return // Continua polling
            } else {
              // QR code não existe mais - pode ter sido pago ou expirado
              console.log(
                'QR code não encontrado - assumindo que foi processado'
              )
              setPaymentProcessingState('paid')
              clearPolling()
              clearExpirationTimer()

              setTimeout(() => {
                // Mostrar animação de sucesso com modal
                setPaymentProcessingState('paid')
              }, 300)
              return
            }
          } catch (qrError) {
            console.log('Erro ao buscar QR codes:', qrError)
            // Se der erro ao buscar QR, pode ter sido processado
            setPaymentProcessingState('paid')
            clearPolling()
            clearExpirationTimer()

            setTimeout(() => {
              Alert.alert(
                '✅ Pagamento Processado!',
                'O pagamento foi confirmado!',
                [
                  {
                    text: 'Continuar',
                    onPress: handleGoBackToDashboard,
                    style: 'default',
                  },
                ]
              )
            }, 500)
            return
          }
        }

        console.log('Status da venda encontrada:', currentSale?.status)

        // Verifica status da venda encontrada
        if (currentSale && currentSale.status === 'PAID') {
          setPaymentProcessingState('paid')
          clearPolling()
          clearExpirationTimer()

          // Mostrar animação de sucesso com modal
          // Aguarda um momento para mostrar a animação
          setTimeout(() => {
            setPaymentProcessingState('paid')
          }, 300)
        } else if (currentSale && currentSale.status === 'CANCELED') {
          setPaymentProcessingState('error')
          clearPolling()
          clearExpirationTimer()

          // Mostrar animação de falha
          setTimeout(() => {
            Alert.alert(
              '❌ Pagamento Cancelado',
              'O pagamento foi cancelado. Você pode gerar um novo QR Code.',
              [
                {
                  text: 'Nova Venda',
                  onPress: handleNewSale,
                  style: 'default',
                },
                {
                  text: 'Voltar',
                  onPress: handleGoBackToDashboard,
                  style: 'cancel',
                },
              ]
            )
          }, 500)
        } else if (currentSale && currentSale.status === 'IN_CANCELATION') {
          setPaymentProcessingState('error')
          clearPolling()
          clearExpirationTimer()

          // Mostrar status de cancelamento
          setTimeout(() => {
            Alert.alert(
              '⚠️ Pagamento em Cancelamento',
              'O pagamento está sendo cancelado. Aguarde ou gere um novo QR Code.',
              [
                {
                  text: 'Nova Venda',
                  onPress: handleNewSale,
                  style: 'default',
                },
                {
                  text: 'Aguardar',
                  onPress: () => {}, // Apenas fecha o modal
                  style: 'cancel',
                },
              ]
            )
          }, 500)
        }
        // Se status ainda é PENDING ou outro, continua polling
      } catch (error: any) {
        console.error('Erro ao verificar status da venda:', error)

        // Se der erro 400 (Bad Request), o QR pode ter expirado ou sido processado
        if (error?.status === 400 || error?.response?.status === 400) {
          // Tenta verificar se o QR ainda existe
          try {
            const qrCodes = await getQrCodeSell()
            const currentQr = qrCodes.find((qr) => qr.id.toString() === saleId)

            if (!currentQr) {
              // QR não existe mais - assumir que foi processado
              setPaymentProcessingState('paid')
              clearPolling()
              clearExpirationTimer()

              setTimeout(() => {
                Alert.alert(
                  '✅ Pagamento Processado!',
                  'O QR Code não está mais ativo. O pagamento foi processado com sucesso!',
                  [
                    {
                      text: 'Continuar',
                      onPress: handleGoBackToDashboard,
                      style: 'default',
                    },
                  ]
                )
              }, 500)
            } else {
              // QR ainda existe, continua polling
              console.log('QR code ainda ativo, continuando verificação...')
            }
          } catch (qrError) {
            console.log('Erro ao verificar QR codes:', qrError)
            // Se não consegue verificar QR, para o polling
            setPaymentProcessingState('error')
            clearPolling()
            clearExpirationTimer()
          }
        } else if (error?.status === 404 || error?.response?.status === 404) {
          setPaymentProcessingState('error')
          clearPolling()
          clearExpirationTimer()

          setTimeout(() => {
            Alert.alert(
              '⚠️ QR Code Não Encontrado',
              'O QR Code pode ter expirado ou sido removido. Gere um novo QR Code.',
              [
                {
                  text: 'Nova Venda',
                  onPress: handleNewSale,
                  style: 'default',
                },
              ]
            )
          }, 500)
        }
        // Para outros erros, continua tentando
      }
    }, 2500) // Verifica a cada 2.5 segundos (mais frequente)
  }

  const clearPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
      pollingInterval.current = null
    }
  }

  const handleGoBackToDashboard = () => {
    clearPolling()
    clearExpirationTimer()
    setShowQrCode(false)
    setPaymentProcessingState('idle')
    setCurrentSaleId(null)
    setTimeLeft(null)
    setIsExpired(false)
    onGoBack()
  }

  // Cleanup polling quando componente desmonta
  useEffect(() => {
    return () => {
      clearPolling()
      clearExpirationTimer()
    }
  }, [])

  const handleConfirm = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true)

      const saleData: CreateQrCodeSellDto = {
        description: data.description.trim(),
        installments: data.installments,
        amount: currentSaleValue,
      }

      const qrCodeResponse = await createQrCode(saleData)

      // Create QR code data with sale information for payment
      if (qrCodeResponse?.id) {
        const qrData = JSON.stringify({
          saleId: qrCodeResponse.id.toString(),
          amount: saleData.amount,
          description: saleData.description,
          installments: saleData.installments,
          shopId: qrCodeResponse.shop.id,
          shopName: qrCodeResponse.shop.name,
          expiresIn: qrCodeResponse.expiresIn,
        })
        setQrCodeData(qrData)
        setShowQrCode(true)
        onConfirmSale(saleData)

        // Buscar dados atualizados do QR code para obter expiresIn atual
        try {
          const qrCodes = await getQrCodeSell()
          const currentQr = qrCodes.find((qr) => qr.id === qrCodeResponse.id)
          if (currentQr && currentQr.expiresIn) {
            // Se expiresIn é um timestamp, calcular segundos restantes
            const now = Date.now()
            const expirationTime = currentQr.expiresIn

            // Se o valor é muito grande, provavelmente é um timestamp
            if (expirationTime > 1000000) {
              const secondsLeft = Math.max(
                0,
                Math.floor((expirationTime - now) / 1000)
              )
              startExpirationTimer(secondsLeft)
            } else {
              // Se é um valor pequeno, provavelmente já são segundos
              startExpirationTimer(currentQr.expiresIn)
            }
          } else {
            // Fallback para o valor original
            const now = Date.now()
            const expirationTime = qrCodeResponse.expiresIn

            if (expirationTime > 1000000) {
              const secondsLeft = Math.max(
                0,
                Math.floor((expirationTime - now) / 1000)
              )
              startExpirationTimer(secondsLeft)
            } else {
              startExpirationTimer(qrCodeResponse.expiresIn)
            }
          }
        } catch (error) {
          console.warn(
            'Erro ao buscar QR code atualizado, usando valor original:',
            error
          )
          // Fallback com conversão se necessário
          const now = Date.now()
          const expirationTime = qrCodeResponse.expiresIn

          if (expirationTime > 1000000) {
            const secondsLeft = Math.max(
              0,
              Math.floor((expirationTime - now) / 1000)
            )
            startExpirationTimer(secondsLeft)
          } else {
            startExpirationTimer(qrCodeResponse.expiresIn)
          }
        }

        // Iniciar polling para detectar pagamento
        startPolling(qrCodeResponse.id.toString())
      } else {
        Alert.alert('Erro', 'Não foi possível gerar o QR Code')
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      Alert.alert('Erro', 'Não foi possível gerar o QR Code')
    } finally {
      setIsLoading(false)
    }
  })

  const handleNewSale = () => {
    clearPolling()
    setPaymentProcessingState('idle')
    setCurrentSaleId(null)
    form.reset()
    setQrCodeData('')
    setShowQrCode(false)
  }

  const handleComplete = () => {
    clearPolling()
    setPaymentProcessingState('idle')
    setCurrentSaleId(null)
    Alert.alert('Sucesso', 'Venda finalizada com sucesso!', [
      { text: 'OK', onPress: () => onGoBack() },
    ])
  }

  const handleSuccessModalComplete = () => {
    clearPolling()
    setPaymentProcessingState('idle')
    setCurrentSaleId(null)
    onGoBack()
  }

  const installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  if (showQrCode) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <ArrowLeftIcon width={20} height={20} color={colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova venda</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Venda com QR Code</Text>
            <Text style={styles.subtitle}>
              Aguarde o portador escanear o QR Code
            </Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrCodeContainer}>
            <View style={styles.qrCodePlaceholder}>
              {isLoading ? (
                <>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.qrCodeText}>Gerando QR Code...</Text>
                </>
              ) : qrCodeData ? (
                <>
                  <QRCode
                    value={qrCodeData}
                    size={120}
                    backgroundColor="#FFFFFF"
                    color="#000000"
                  />
                  <Text style={styles.qrCodeText}>Escaneie para pagar</Text>
                </>
              ) : (
                <>
                  <QrCodeIcon width={120} height={120} color={colors.primary} />
                  <Text style={styles.qrCodeText}>QR Code da Venda</Text>
                </>
              )}
            </View>
          </View>

          {/* Summary Card */}
          <View style={styles.qrSummaryCard}>
            <Text style={styles.qrSummaryTitle}>Resumo da Venda</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.qrSummaryLabel}>Descrição:</Text>
                <Text style={styles.qrSummaryValue}>{currentDescription}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.qrSummaryLabel}>Valor Total:</Text>
                <Text style={styles.qrSummaryValue}>
                  {currentSaleValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.qrSummaryLabel}>Parcelas:</Text>
                <Text style={styles.qrSummaryValue}>
                  {currentInstallments}x de{' '}
                  {installmentValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </View>

              {/* Timer de expiração */}
              {timeLeft !== null && (
                <View style={styles.summaryRow}>
                  <Text style={styles.qrSummaryLabel}>Expira em:</Text>
                  <Text
                    style={[
                      styles.qrSummaryValue,
                      {
                        color: timeLeft < 60 ? '#ef4444' : '#22c55e',
                        fontWeight: 'bold',
                      },
                    ]}
                  >
                    {formatTime(timeLeft)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              💡 Peça ao portador para escanear o QR Code com o aplicativo dele
            </Text>
          </View>

          {/* Payment Status */}
          {paymentProcessingState === 'waiting' && (
            <View style={styles.paymentStatusContainer}>
              <View style={styles.paymentStatusIndicator}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.paymentStatusText}>
                  Aguardando pagamento...
                </Text>
              </View>
            </View>
          )}

          {paymentProcessingState === 'paid' && (
            <View style={styles.paymentStatusContainer}>
              <View
                style={[
                  styles.paymentStatusIndicator,
                  { backgroundColor: '#dcfce7' },
                ]}
              >
                <Text style={{ fontSize: 16, color: '#15803d' }}>✅</Text>
                <Text style={[styles.paymentStatusText, { color: '#15803d' }]}>
                  Pagamento confirmado!
                </Text>
              </View>
            </View>
          )}

          {paymentProcessingState === 'error' && (
            <View style={styles.paymentStatusContainer}>
              <View
                style={[
                  styles.paymentStatusIndicator,
                  { backgroundColor: '#fef2f2' },
                ]}
              >
                <Text style={{ fontSize: 16, color: '#dc2626' }}>❌</Text>
                <Text style={[styles.paymentStatusText, { color: '#dc2626' }]}>
                  Problema no pagamento
                </Text>
              </View>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleNewSale}
            >
              <Text style={styles.secondaryButtonText}>Nova Venda</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleComplete}
            >
              <Text style={styles.primaryButtonText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Success Processing Modal */}
        <SellProcessingModal
          visible={paymentProcessingState === 'paid'}
          state="success"
          onComplete={handleSuccessModalComplete}
        />
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <ArrowLeftIcon width={20} height={20} color={colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova venda</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Venda com QR Code</Text>
            <Text style={styles.subtitle}>Preencha os dados da venda</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { marginBottom: -2 }]}>
                Descrição
              </Text>
              <View style={[styles.inputContainer, { marginBottom: 18 }]}>
                <Controller
                  control={form.control}
                  name="description"
                  rules={{
                    required: 'Descrição é obrigatória',
                    minLength: {
                      value: 3,
                      message: 'Descrição deve ter pelo menos 3 caracteres',
                    },
                  }}
                  render={({
                    field: { onChange, value },
                  }: {
                    field: {
                      onChange: (value: string) => void
                      value: string
                    }
                  }) => (
                    <TextInput
                      style={styles.textInput}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Descreva o produto ou serviço"
                      placeholderTextColor={colors.gray[400]}
                      multiline={true}
                      numberOfLines={2}
                    />
                  )}
                />
              </View>
            </View>

            {/* Sale Value */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Valor da Venda</Text>
              <View style={styles.inputContainer}>
                <View style={styles.currencyInputContainer}>
                  <Controller
                    control={form.control}
                    name="saleValue"
                    rules={{
                      required: 'Valor da venda é obrigatório',
                      validate: (value: string) => {
                        const numValue = parseCurrencyToNumber(value)
                        return numValue > 0 || 'Valor deve ser maior que zero'
                      },
                    }}
                    render={({
                      field: { onChange, value },
                    }: {
                      field: {
                        onChange: (value: string) => void
                        value: string
                      }
                    }) => (
                      <TextInput
                        style={styles.currencyInput}
                        value={value}
                        onChangeText={(text: string) =>
                          onChange(formatCurrency(text))
                        }
                        placeholder="R$ 0,00"
                        keyboardType="numeric"
                        placeholderTextColor={colors.gray[400]}
                      />
                    )}
                  />
                  <View style={styles.inputIcon}>
                    <DollarIcon
                      width={24}
                      height={24}
                      color={colors.gray[400]}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Installments */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Número de Parcelas</Text>
              <TouchableOpacity
                style={styles.selectContainer}
                onPress={() => setShowInstallmentModal(true)}
              >
                <View style={styles.inputIcon}>
                  <DocumentIcon
                    width={20}
                    height={20}
                    color={colors.gray[400]}
                  />
                </View>
                <Text style={styles.selectText}>
                  {currentSaleValue > 0
                    ? `${currentInstallments}x de ${installmentValue.toLocaleString(
                        'pt-BR',
                        {
                          style: 'currency',
                          currency: 'BRL',
                        }
                      )}`
                    : `${currentInstallments}x`}
                </Text>
                <View style={styles.selectArrow}>
                  <Text style={styles.selectArrowText}>▼</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Summary Card - Only show when form is valid */}
            {isFormValid && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumo da Venda</Text>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Descrição:</Text>
                    <Text style={styles.summaryValue}>
                      {currentDescription}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Valor Total:</Text>
                    <Text style={styles.summaryValue}>
                      {currentSaleValue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Parcelas:</Text>
                    <Text style={styles.summaryValue}>
                      {currentInstallments}x de{' '}
                      {installmentValue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onGoBack}
              >
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!isFormValid || isLoading) && styles.primaryButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!isFormValid || isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Gerando...' : 'Confirmar Venda'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Installment Selection Modal */}
        <Modal
          visible={showInstallmentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInstallmentModal(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setShowInstallmentModal(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Selecione o número de parcelas
                  </Text>
                  <FlatList
                    data={installmentOptions}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          currentInstallments === item && styles.selectedOption,
                        ]}
                        onPress={() => {
                          form.setValue('installments', item)
                          setShowInstallmentModal(false)
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            currentInstallments === item &&
                              styles.selectedOptionText,
                          ]}
                        >
                          {currentSaleValue > 0
                            ? `${item}x de ${(
                                currentSaleValue / item
                              ).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}`
                            : `${item}x`}
                        </Text>
                      </TouchableOpacity>
                    )}
                    style={styles.optionsList}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowInstallmentModal(false)}
                  >
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 41,
    gap: 8,
  },
  backButton: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    letterSpacing: -0.32,
  },
  content: {
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 363,
    alignSelf: 'center',
    paddingTop: 12,
  },
  titleSection: {
    paddingBottom: 15,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '#101828',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray[500],
    lineHeight: 20,
  },
  form: {
    gap: 24,
  },
  fieldContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#364153',
    lineHeight: 20,
    marginBottom: 10,
  },
  inputContainer: {
    position: 'relative',
  },
  currencyInputContainer: {
    backgroundColor: colors.gray[50],
    borderWidth: 1.45,
    borderColor: colors.gray[300],
    borderRadius: 14,
    height: 67,
    paddingLeft: 48,
    paddingRight: 16,
    justifyContent: 'center',
  },
  currencyInput: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.primaryText,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -12,
    zIndex: 1,
  },
  selectContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.45,
    borderColor: colors.gray[300],
    borderRadius: 14,
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: colors.primaryText,
    marginLeft: 48,
    textAlign: 'left',
  },
  selectArrow: {
    marginLeft: 8,
  },
  selectArrowText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  selectedOption: {
    backgroundColor: '#f0fdf4',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.primaryText,
  },
  selectedOptionText: {
    color: '#15803d',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryText,
  },
  summaryCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.45,
    borderColor: '#b9f8cf',
    borderRadius: 14,
    padding: 17,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0d542b',
    lineHeight: 20,
  },
  summaryContent: {
    gap: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#008236',
    lineHeight: 20,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0d542b',
    lineHeight: 20,
  },
  qrCodeContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  qrCodePlaceholder: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.45,
    borderColor: colors.gray[200],
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    minWidth: 200,
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryText,
  },
  qrSummaryCard: {
    backgroundColor: colors.foreground,
    borderWidth: 1.45,
    borderColor: colors.primary,
    borderRadius: 14,
    padding: 17,
    gap: 8,
  },
  qrSummaryTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.primary,
    lineHeight: 20,
  },
  qrSummaryLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.primary,
    lineHeight: 20,
  },
  qrSummaryValue: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.primaryText,
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
  },
  instructionsText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray[600],
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 54.9,
    borderWidth: 1.45,
    borderColor: colors.gray[300],
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#364153',
    lineHeight: 24,
  },
  primaryButton: {
    flex: 1,
    height: 54.9,
    backgroundColor: '#5d0ec0',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: colors.primaryText,
    backgroundColor: colors.gray[50],
    borderWidth: 1.45,
    borderColor: colors.gray[300],
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlignVertical: 'top',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Payment status styles
  paymentStatusContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  paymentStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  paymentStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
})

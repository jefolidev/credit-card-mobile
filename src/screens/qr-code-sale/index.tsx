import React, { useState } from 'react'
import {
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
import { ArrowLeftIcon } from 'src/assets/arrow-left'
import { DocumentIcon } from 'src/assets/document-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import { QrCodeIcon } from 'src/assets/qr-code-icon'
import { colors } from 'src/theme/colors'
import { formatCurrency, parseCurrencyToNumber } from 'src/utils'

interface QrCodeSaleProps {
  onGoBack: () => void
  onConfirmSale: (saleData: QrSaleData) => void
}

interface QrSaleData {
  value: number
  installments: number
}

export function QrCodeSale({ onGoBack, onConfirmSale }: QrCodeSaleProps) {
  const [saleValue, setSaleValue] = useState('')
  const [installments, setInstallments] = useState(1)
  const [showQrCode, setShowQrCode] = useState(false)
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)

  const getSaleValue = (): number => {
    return parseCurrencyToNumber(saleValue)
  }

  const getInstallmentValue = (): number => {
    const value = getSaleValue()
    return value / installments
  }

  const isFormValid = (): boolean => {
    const value = getSaleValue()
    return value > 0 && installments > 0
  }

  const handleConfirm = () => {
    if (!isFormValid()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.')
      return
    }

    const saleData: QrSaleData = {
      value: getSaleValue(),
      installments,
    }

    setShowQrCode(true)
    onConfirmSale(saleData)
  }

  const handleNewSale = () => {
    setSaleValue('')
    setInstallments(1)
    setShowQrCode(false)
  }

  const handleComplete = () => {
    Alert.alert('Sucesso', 'Venda finalizada com sucesso!', [
      { text: 'OK', onPress: () => onGoBack() },
    ])
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
              <QrCodeIcon width={120} height={120} color={colors.primary} />
              <Text style={styles.qrCodeText}>QR Code da Venda</Text>
            </View>
          </View>

          {/* Summary Card */}
          <View style={styles.qrSummaryCard}>
            <Text style={styles.qrSummaryTitle}>Resumo da Venda</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.qrSummaryLabel}>Valor Total:</Text>
                <Text style={styles.qrSummaryValue}>
                  {getSaleValue().toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.qrSummaryLabel}>Parcelas:</Text>
                <Text style={styles.qrSummaryValue}>
                  {installments}x de{' '}
                  {getInstallmentValue().toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              💡 Peça ao portador para escanear o QR Code com o aplicativo dele
            </Text>
          </View>

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
            {/* Sale Value */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Valor da Venda</Text>
              <View style={styles.inputContainer}>
                <View style={styles.currencyInputContainer}>
                  <TextInput
                    style={styles.currencyInput}
                    value={saleValue}
                    onChangeText={(text) => setSaleValue(formatCurrency(text))}
                    placeholder="R$ 0,00"
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray[400]}
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
                  {getSaleValue() > 0
                    ? `${installments}x de ${getInstallmentValue().toLocaleString(
                        'pt-BR',
                        {
                          style: 'currency',
                          currency: 'BRL',
                        }
                      )}`
                    : `${installments}x`}
                </Text>
                <View style={styles.selectArrow}>
                  <Text style={styles.selectArrowText}>▼</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Summary Card - Only show when form is valid */}
            {isFormValid() && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumo da Venda</Text>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Valor Total:</Text>
                    <Text style={styles.summaryValue}>
                      {getSaleValue().toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Parcelas:</Text>
                    <Text style={styles.summaryValue}>
                      {installments}x de{' '}
                      {getInstallmentValue().toLocaleString('pt-BR', {
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
                  !isFormValid() && styles.primaryButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!isFormValid()}
              >
                <Text style={styles.primaryButtonText}>Confirmar Venda</Text>
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
                          installments === item && styles.selectedOption,
                        ]}
                        onPress={() => {
                          setInstallments(item)
                          setShowInstallmentModal(false)
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            installments === item && styles.selectedOptionText,
                          ]}
                        >
                          {getSaleValue() > 0
                            ? `${item}x de ${(
                                getSaleValue() / item
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
})

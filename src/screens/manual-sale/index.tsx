import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { ArrowLeftIcon } from 'src/assets/arrow-left'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { DocumentIcon } from 'src/assets/document-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import { KeyIcon } from 'src/assets/key-icon'
import { SellProcessingModal } from 'src/components/sell-processing-modal'
import { useSells } from 'src/contexts/use-sells'
import { CreateSellDto } from 'src/services/sells/validations/create-sell.dto'
import { colors } from 'src/theme/colors'
import {
  calculateInstallmentValue,
  formatCardNumber,
  formatCurrency,
  parseCurrencyToNumber,
} from 'src/utils'

interface ManualSaleProps {
  onGoBack: () => void
  onContinueToPayment: (saleData: CreateSellDto) => void
}

interface SaleFormData {
  description: string
  saleValue: string
  installments: number
}

interface PaymentFormData {
  cardNumber: string
  password: string
}

export function ManualSale({ onGoBack, onContinueToPayment }: ManualSaleProps) {
  const [showInstallmentModal, setShowInstallmentModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [processingState, setProcessingState] = useState<
    'loading' | 'success' | 'error' | 'idle'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const { createSell } = useSells()

  const saleForm = useForm<SaleFormData>({
    defaultValues: {
      description: '',
      saleValue: '',
      installments: 1,
    },
  })

  const paymentForm = useForm<PaymentFormData>({
    defaultValues: {
      cardNumber: '',
      password: '',
    },
  })

  const currentSaleValue = parseCurrencyToNumber(saleForm.watch('saleValue'))
  const currentInstallments = saleForm.watch('installments')
  const currentDescription = saleForm.watch('description')

  const isFormValid =
    currentDescription.trim().length > 0 && currentSaleValue > 0
  const installmentValue = calculateInstallmentValue(
    currentSaleValue,
    currentInstallments
  )

  const handleContinue = saleForm.handleSubmit(() => {
    setShowPaymentModal(true)
  })

  const handleFinalizeSale = paymentForm.handleSubmit(async (paymentData) => {
    const saleData = saleForm.getValues()
    const cardNumberClean = paymentData.cardNumber.replace(/\s/g, '')

    const finalSaleData: CreateSellDto = {
      description: saleData.description.trim(),
      amount: currentSaleValue,
      cardNumber: cardNumberClean,
      installments: saleData.installments,
      cardPassword: paymentData.password,
    }

    try {
      setProcessingState('loading')
      setShowPaymentModal(false)

      await createSell(finalSaleData)

      setProcessingState('success')

      // Wait for success animation to complete
      setTimeout(() => {
        onContinueToPayment(finalSaleData)
      }, 2000)
    } catch (error: any) {
      setProcessingState('error')
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Erro inesperado ao processar a venda'
      )
    }
  })

  const handleProcessingComplete = () => {
    setProcessingState('idle')
    setErrorMessage('')

    if (processingState === 'error') {
      // Reopen payment modal to try again
      setShowPaymentModal(true)
    }
  }

  const installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
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
            <Text style={styles.title}>Venda Manual</Text>
            <Text style={styles.subtitle}>Preencha os dados da venda</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Descrição da Venda</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={currentDescription}
                  onChangeText={(text) =>
                    saleForm.setValue('description', text)
                  }
                  placeholder="Descreva o que está sendo vendido"
                  placeholderTextColor={colors.gray[400]}
                  maxLength={100}
                />
              </View>
            </View>

            {/* Sale Value */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Valor da Venda</Text>
              <View style={styles.inputContainer}>
                <View style={styles.currencyInputContainer}>
                  <Controller
                    control={saleForm.control}
                    name="saleValue"
                    rules={{
                      required: 'Valor é obrigatório',
                      validate: (value) => {
                        const numValue = parseCurrencyToNumber(value)
                        return numValue > 0 || 'Valor deve ser maior que zero'
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.currencyInput}
                        value={value}
                        onChangeText={(text) => onChange(formatCurrency(text))}
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
                  !isFormValid && styles.primaryButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!isFormValid}
              >
                <Text style={styles.primaryButtonText}>Continuar</Text>
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
                          saleForm.setValue('installments', item)
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

        {/* Payment Modal */}
        <Modal
          visible={showPaymentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.paymentModalContent}>
                  <Text style={styles.modalTitle}>Dados do Pagamento</Text>

                  <View style={styles.paymentForm}>
                    {/* Card Number */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Número do Cartão</Text>
                      <View style={styles.inputContainer}>
                        <View style={styles.inputIcon}>
                          <CreditCardIcon
                            width={20}
                            height={20}
                            color={colors.gray[400]}
                          />
                        </View>
                        <Controller
                          control={paymentForm.control}
                          name="cardNumber"
                          rules={{
                            required: 'Número do cartão é obrigatório',
                            validate: (value) => {
                              const clean = value.replace(/\s/g, '')
                              return (
                                clean.length === 16 ||
                                'Cartão deve ter 16 dígitos'
                              )
                            },
                          }}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              style={styles.input}
                              value={value}
                              onChangeText={(text) =>
                                onChange(formatCardNumber(text))
                              }
                              placeholder="0000 0000 0000 0000"
                              keyboardType="numeric"
                              placeholderTextColor={colors.gray[400]}
                              maxLength={19}
                            />
                          )}
                        />
                      </View>
                    </View>

                    {/* Password */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Senha do Cartão</Text>
                      <View style={styles.inputContainer}>
                        <View style={styles.inputIcon}>
                          <KeyIcon
                            width={20}
                            height={20}
                            color={colors.gray[400]}
                          />
                        </View>
                        <Controller
                          control={paymentForm.control}
                          name="password"
                          rules={{
                            required: 'Senha é obrigatória',
                            minLength: {
                              value: 4,
                              message: 'Senha deve ter pelo menos 4 dígitos',
                            },
                          }}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              style={styles.input}
                              value={value}
                              onChangeText={onChange}
                              placeholder="••••"
                              keyboardType="numeric"
                              secureTextEntry
                              placeholderTextColor={colors.gray[400]}
                              maxLength={6}
                            />
                          )}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.paymentButtonContainer}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowPaymentModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.finishButton}
                      onPress={handleFinalizeSale}
                    >
                      <Text style={styles.finishButtonText}>
                        Finalizar Venda
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Sell Processing Modal */}
        <SellProcessingModal
          visible={processingState !== 'idle'}
          state={processingState}
          errorMessage={errorMessage}
          onComplete={handleProcessingComplete}
        />
      </SafeAreaView>
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
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.45,
    borderColor: colors.gray[300],
    borderRadius: 14,
    height: 51,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
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
  paymentModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  paymentForm: {
    gap: 20,
    marginVertical: 20,
  },
  paymentButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryText,
  },
  finishButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#5d0ec0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
})

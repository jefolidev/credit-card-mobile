import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import CreditCard from 'src/components/credit-card'
import { Header } from 'src/components/header'
import { useCard } from 'src/contexts/use-card'
import { ResponseGetPortatorBalance } from 'src/services/cards/responses-dto'
import { colors } from 'src/theme/colors'
import { formatCardNumber } from 'src/utils'
import { getErrorMessage } from './utils'

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

interface SearchFormData {
  searchText: string
}

interface BalanceInquiryProps {
  onGoBack?: () => void
}

export function BalanceInquiry({ onGoBack }: BalanceInquiryProps) {
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [foundCard, setFoundCard] = useState<ResponseGetPortatorBalance | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [cardPassword, setCardPassword] = useState('')
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false)

  const { getPortatorBalanceBySearch } = useCard()

  const { control, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      searchText: '',
    },
  })

  const searchText = watch('searchText')

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  const handleInputChange = (text: string) => {
    const maskedText = formatCardNumber(text)
    setValue('searchText', maskedText)
  }

  const handleSearch = async () => {
    if (!searchText.trim()) return

    setIsLoading(true)
    setSearchPerformed(true)

    try {
      const searchParams = {
        cardNumber: searchText.replace(/\s/g, ''),
      }

      const result = await getPortatorBalanceBySearch(searchParams)

      if (result) {
        setFoundCard(result)
      } else {
        setFoundCard(null)
        showToastMessage(
          'Nenhum cartão foi encontrado com os dados informados.'
        )
      }
    } catch (error: any) {
      console.error('Erro ao buscar saldo:', error)
      setFoundCard(null)

      showToastMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardPress = () => {
    if (!isExpanded) {
      setShowPasswordModal(true)
    } else {
      setIsExpanded(false)
    }
  }

  const handlePasswordSubmit = async () => {
    if (!cardPassword || cardPassword.length !== 4) {
      showToastMessage('Por favor, digite a senha de 4 dígitos do cartão.')
      return
    }

    setIsVerifyingPassword(true)

    try {
      // Simular verificação de senha - substitua pela sua lógica de validação
      // Por exemplo: await cardServices.verifyCardPassword(foundCard?.cardNumber, cardPassword)

      // Simulação: senha correta é "1234" (substitua pela sua lógica)
      if (cardPassword === '1234') {
        setShowPasswordModal(false)
        setIsExpanded(true)
        setCardPassword('')
      } else {
        showToastMessage('Senha incorreta. Tente novamente.')
      }
    } catch (error) {
      showToastMessage('Erro ao verificar senha. Tente novamente.')
    } finally {
      setIsVerifyingPassword(false)
    }
  }

  const handleCancelPassword = () => {
    setShowPasswordModal(false)
    setCardPassword('')
  }

  const getSearchIcon = () => {
    return <DocumentIcon width={20} height={20} color={colors.gray[400]} />
  }

  const renderCard = () => {
    if (!foundCard) return null

    // Calcular valores do saldo
    const totalLimit = foundCard.totalLimit || 2000
    const availableBalance = foundCard.limitAvailable
    const usedBalance = totalLimit - availableBalance
    const usagePercentage =
      totalLimit > 0 ? (usedBalance / totalLimit) * 100 : 0

    const cardData = {
      id: foundCard.cardNumber,
      cardNumber: foundCard.cardNumber,
      holderName: foundCard.ownerName,
      cpf: foundCard.ownerCpf,
      cardType: 'Portador',
      status: 'active' as const,
      totalLimit: {
        totalLimit,
        availableBalance,
        usedBalance,
        dueDate: '',
      },
    }

    return (
      <View>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={handleCardPress}
        >
          <CreditCard
            cardNumber={cardData.cardNumber}
            cardOwner={cardData.holderName}
            cpf={cardData.cpf}
            shouldRenderNumber={true}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.balanceInfoContainer}>
            {/* Header */}
            <View style={styles.balanceInfoHeader}>
              <DollarIcon width={20} height={20} color={colors.primary} />
              <Text style={styles.balanceInfoTitle}>Informação de Saldo</Text>
            </View>

            {/* Balance Details */}
            <View style={styles.balanceDetails}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Saldo Total</Text>
                <Text style={styles.balanceValue}>
                  {formatCurrency(totalLimit)}
                </Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Saldo Disponível</Text>
                <Text style={styles.balanceValue}>
                  {formatCurrency(availableBalance)}
                </Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Saldo Utilizado</Text>
                <Text style={styles.balanceValue}>
                  {formatCurrency(usedBalance)}
                </Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Vencimento da Fatura</Text>
                <Text style={styles.balanceValue}>Dia 15</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(usagePercentage, 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>0%</Text>
                <Text style={styles.progressLabel}>100%</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyTitle}>Buscando...</Text>
          <Text style={styles.emptyDescription}>
            Aguarde enquanto consultamos os dados do portador
          </Text>
        </View>
      )
    }

    if (!searchPerformed) {
      return (
        <View style={styles.emptyState}>
          <DocumentIcon width={64} height={64} color={colors.gray[300]} />
          <Text style={styles.emptyTitle}>Nenhuma consulta realizada</Text>
          <Text style={styles.emptyDescription}>
            Digite um número do cartão e clique em buscar
          </Text>
        </View>
      )
    }

    if (!foundCard) {
      return (
        <View style={styles.emptyState}>
          <DocumentIcon width={64} height={64} color={colors.gray[300]} />
          <Text style={styles.emptyTitle}>Nenhum cartão encontrado</Text>
          <Text style={styles.emptyDescription}>
            Não foi encontrado nenhum cartão com os dados informados
          </Text>
        </View>
      )
    }

    return null
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Header
          title="Consulta de Saldo"
          showBackButton={true}
          onBackPress={onGoBack}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              {getSearchIcon()}
              <Controller
                control={control}
                name="searchText"
                render={({ field: { value } }) => (
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Digite o número do cartão"
                    placeholderTextColor="#99a1af"
                    value={value}
                    onChangeText={handleInputChange}
                    keyboardType={'numeric'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    selectionColor={colors.primary}
                    textContentType="none"
                  />
                )}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.searchButton,
                searchText.trim()
                  ? styles.searchButtonActive
                  : styles.searchButtonInactive,
              ]}
              onPress={handleSearch}
              disabled={!searchText.trim() || isLoading}
            >
              <Text
                style={[
                  styles.searchButtonText,
                  searchText.trim()
                    ? styles.searchButtonTextActive
                    : styles.searchButtonTextInactive,
                ]}
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Alert */}
          <View style={styles.alertContainer}>
            <DocumentIcon width={20} height={20} color="#1c398e" />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Informação</Text>
              <Text style={styles.alertDescription}>
                Digite o número do cartão do portador para consultar o saldo
                disponível e informações do cartão.
              </Text>
            </View>
          </View>

          {/* Results */}
          <View style={styles.resultsContainer}>
            {foundCard ? renderCard() : renderEmptyState()}
          </View>
        </ScrollView>

        {/* Toast */}
        {showToast && (
          <View style={styles.toastContainer}>
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          </View>
        )}

        {/* Password Modal */}
        <Modal
          visible={showPasswordModal}
          transparent
          animationType="slide"
          onRequestClose={handleCancelPassword}
        >
          <TouchableWithoutFeedback onPress={handleCancelPassword}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.passwordModalContent}>
                  <Text style={styles.modalTitle}>Senha do Cartão</Text>
                  <Text style={styles.modalDescription}>
                    Digite a senha de 4 dígitos para visualizar as informações
                    do cartão
                  </Text>

                  <View style={styles.passwordContainer}>
                    <View style={styles.passwordInputContainer}>
                      <Text style={{ fontSize: 20, color: colors.gray[400] }}>
                        🔑
                      </Text>
                      <TextInput
                        style={styles.passwordInput}
                        value={cardPassword}
                        onChangeText={(text) => {
                          const numbersOnly = text.replace(/[^0-9]/g, '')
                          setCardPassword(numbersOnly)
                        }}
                        placeholder="••••"
                        keyboardType="numeric"
                        secureTextEntry
                        placeholderTextColor={colors.gray[400]}
                        maxLength={4}
                        autoFocus
                      />
                    </View>
                  </View>

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={handleCancelPassword}
                    >
                      <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalConfirmButton,
                        (cardPassword.length !== 4 || isVerifyingPassword) &&
                          styles.modalButtonDisabled,
                      ]}
                      onPress={handlePasswordSubmit}
                      disabled={
                        cardPassword.length !== 4 || isVerifyingPassword
                      }
                    >
                      <Text style={styles.modalConfirmButtonText}>
                        {isVerifyingPassword ? 'Verificando...' : 'Confirmar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingTop: 24,
    gap: 16,
    paddingBottom: 32,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 26,
    paddingVertical: 19,
    borderRadius: 10,
    borderWidth: 1.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  cardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  balanceInfoContainer: {
    backgroundColor: 'white',
    borderWidth: 1.25,
    borderColor: '#d1d5dc',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    gap: 16,
  },
  balanceInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceInfoTitle: {
    fontSize: 16,
    fontFamily: 'Arimo_600SemiBold',
    color: '#101828',
    lineHeight: 24,
  },
  balanceDetails: {
    gap: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Arimo_400Regular',
    color: '#6a7282',
    lineHeight: 20,
  },
  balanceValue: {
    fontSize: 14,
    fontFamily: 'Arimo_600SemiBold',
    color: '#101828',
    lineHeight: 20,
  },
  progressContainer: {
    gap: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Arimo_400Regular',
    color: '#6a7282',
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.25,
    borderColor: '#d1d5dc',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arimo_400Regular',
    color: '#101828',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  searchButton: {
    paddingHorizontal: 24,
    paddingVertical: 12.87,
    borderRadius: 14,
    height: 50.5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  searchButtonActive: {
    backgroundColor: colors.primary,
  },
  searchButtonInactive: {
    backgroundColor: '#d1d5dc',
  },
  searchButtonText: {
    fontSize: 16,
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  searchButtonTextActive: {
    color: 'white',
  },
  searchButtonTextInactive: {
    color: 'white',
  },
  alertContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.25,
    borderColor: '#bedbff',
    borderRadius: 14,
    padding: 17.25,
    flexDirection: 'row',
    gap: 8,
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontSize: 14,
    color: '#1c398e',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  alertDescription: {
    fontSize: 12,
    color: '#1447e6',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 19.5,
  },
  resultsContainer: {
    flex: 1,
  },
  cardsList: {
    gap: 10,
  },
  separator: {
    height: 10,
  },
  emptyState: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1.25,
    borderColor: '#d1d5dc',
    borderRadius: 16,
    padding: 49,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Arimo_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  passwordModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  passwordContainer: {
    marginBottom: 32,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    color: colors.primaryText,
    textAlign: 'center',
    letterSpacing: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 50,
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryText,
  },
  modalConfirmButton: {
    flex: 1,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  modalButtonDisabled: {
    backgroundColor: colors.gray[300],
    opacity: 0.6,
  },
})

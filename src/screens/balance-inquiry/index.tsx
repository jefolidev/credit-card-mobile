import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Keyboard,
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
import { UserIcon } from 'src/assets/user-icon'
import CreditCard from 'src/components/credit-card'
import { Header } from 'src/components/header'
import { useCard } from 'src/contexts/use-card'
import { ResponseGetPortatorBalance } from 'src/services/cards/responses-dto'
import { colors } from 'src/theme/colors'
import { applyCpfMask, cleanCpf, formatCardNumber } from 'src/utils'
import { getErrorMessage } from './utils'

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

type SearchType = 'cpf' | 'card'

interface SearchFormData {
  searchText: string
  searchType: SearchType
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

  const { getPortatorBalance } = useCard()

  const { control, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      searchText: '',
      searchType: 'cpf',
    },
  })

  const searchText = watch('searchText')
  const searchType = watch('searchType')

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

  useEffect(() => {
    // Reset search when changing search type
    if (searchText) {
      setValue('searchText', '')
      setSearchPerformed(false)
      setFoundCard(null)
      setIsExpanded(false)
    }
  }, [searchType, setValue])

  const handleInputChange = (text: string) => {
    let maskedText = text

    switch (searchType) {
      case 'cpf':
        maskedText = applyCpfMask(text)
        break
      case 'card':
        maskedText = formatCardNumber(text)
        break
      default:
        maskedText = text
        break
    }

    setValue('searchText', maskedText)
  }

  const handleSearch = async () => {
    if (!searchText.trim()) return

    setIsLoading(true)
    setSearchPerformed(true)

    try {
      let searchParams: { cpf?: string; cardNumber?: string } = {}

      if (searchType === 'cpf') {
        searchParams.cpf = cleanCpf(searchText)
      } else if (searchType === 'card') {
        searchParams.cardNumber = searchText.replace(/\s/g, '')
      }

      const result = await getPortatorBalance(searchParams)

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
    setIsExpanded(!isExpanded)
  }

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'cpf':
        return 'Digite o CPF'
      case 'card':
        return 'Digite o número do cartão'
      default:
        return 'Buscar'
    }
  }

  const getSearchIcon = () => {
    switch (searchType) {
      case 'cpf':
        return <UserIcon width={20} height={20} color={colors.gray[400]} />
      case 'card':
        return <DocumentIcon width={20} height={20} color={colors.gray[400]} />
      default:
        return <DocumentIcon width={20} height={20} color={colors.gray[400]} />
    }
  }

  const renderFilterButton = (type: SearchType, label: string) => {
    const isActive = searchType === type
    return (
      <TouchableOpacity
        key={type}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive ? colors.primary : 'white',
            borderColor: isActive ? colors.primary : '#d1d5dc',
          },
        ]}
        onPress={() => setValue('searchType', type)}
      >
        <Text
          style={[
            styles.filterButtonText,
            { color: isActive ? 'white' : '#364153' },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
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
      balance: {
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
            cpf={applyCpfMask(cardData.cpf)}
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
            Digite um {searchType === 'cpf' ? 'CPF' : 'número do cartão'} e
            clique em buscar
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
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {renderFilterButton('cpf', 'Buscar por CPF')}
            {renderFilterButton('card', 'Buscar por Cartão')}
          </View>

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
                    placeholder={getSearchPlaceholder()}
                    placeholderTextColor="#99a1af"
                    value={value}
                    onChangeText={handleInputChange}
                    keyboardType={searchType === 'cpf' ? 'numeric' : 'numeric'}
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
                Digite o {searchType === 'cpf' ? 'CPF' : 'número do cartão'} do
                portador para consultar o saldo disponível e informações do
                cartão.
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
    paddingVertical: 12,
    height: 50,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arimo_400Regular',
    color: '#101828',
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
})

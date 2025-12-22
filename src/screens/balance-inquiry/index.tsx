import React, { useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import { UserIcon } from 'src/assets/user-icon'
import { CreditCardDisplay } from 'src/components/credit-card-display'
import { Header } from 'src/components/header'
import { colors } from 'src/theme/colors'

type SearchType = 'cpf' | 'card'

// Mock data - será substituído por dados reais
interface CardData {
  id: string
  cardNumber: string
  holderName: string
  cpf: string
  cardType: string
  status: 'active' | 'inactive'
  balance: {
    totalLimit: number
    availableBalance: number
    usedBalance: number
    dueDate: string
  }
}

const mockCards: CardData[] = [
  {
    id: 'CARD001',
    cardNumber: '5412 7890 1234 5678',
    holderName: 'MARIA SILVA OLIVEIRA',
    cpf: '123.456.789-00',
    cardType: 'Gold',
    status: 'active',
    balance: {
      totalLimit: 5000.0,
      availableBalance: 4250.0,
      usedBalance: 750.0,
      dueDate: 'Dia 15',
    },
  },
]

interface BalanceInquiryProps {
  onGoBack?: () => void
}

export function BalanceInquiry({ onGoBack }: BalanceInquiryProps) {
  const [searchText, setSearchText] = useState('')
  const [activeSearchType, setActiveSearchType] = useState<SearchType>('cpf')
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [foundCards, setFoundCards] = useState<CardData[]>([])
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)

  const handleSearch = () => {
    if (!searchText.trim()) return

    setSearchPerformed(true)

    // Simular busca
    const searchLower = searchText.toLowerCase()
    const results = mockCards.filter((card) => {
      switch (activeSearchType) {
        case 'cpf':
          return card.cpf
            .replace(/\D/g, '')
            .includes(searchText.replace(/\D/g, ''))
        case 'card':
          return card.cardNumber
            .replace(/\s/g, '')
            .includes(searchText.replace(/\s/g, ''))
        default:
          return false
      }
    })

    setFoundCards(results)
    setSelectedCard(null)
  }

  const handleCardPress = (card: CardData) => {
    setSelectedCard(selectedCard?.id === card.id ? null : card)
  }

  const getSearchPlaceholder = () => {
    switch (activeSearchType) {
      case 'cpf':
        return 'Digite o CPF'
      case 'card':
        return 'Digite o número do cartão'
      default:
        return 'Buscar'
    }
  }

  const getSearchIcon = () => {
    switch (activeSearchType) {
      case 'cpf':
        return <UserIcon width={20} height={20} color={colors.gray[400]} />
      case 'card':
        return <DocumentIcon width={20} height={20} color={colors.gray[400]} />
      default:
        return <DocumentIcon width={20} height={20} color={colors.gray[400]} />
    }
  }

  const renderFilterButton = (type: SearchType, label: string) => {
    const isActive = activeSearchType === type
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
        onPress={() => setActiveSearchType(type)}
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

  const renderCard = ({ item }: { item: CardData }) => (
    <CreditCardDisplay
      card={item}
      onPress={() => handleCardPress(item)}
      isExpanded={selectedCard?.id === item.id}
    />
  )

  const renderEmptyState = () => {
    if (!searchPerformed) {
      return (
        <View style={styles.emptyState}>
          <DocumentIcon width={64} height={64} color={colors.gray[300]} />
          <Text style={styles.emptyTitle}>Nenhuma consulta realizada</Text>
          <Text style={styles.emptyDescription}>
            Digite um {activeSearchType === 'cpf' ? 'CPF' : 'número do cartão'}{' '}
            e clique em buscar
          </Text>
        </View>
      )
    }

    if (foundCards.length === 0) {
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
    <View style={styles.container}>
      <Header
        title="Consulta de Saldo"
        showBackButton={true}
        onBackPress={onGoBack}
      />

      <View style={styles.content}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {renderFilterButton('cpf', 'Buscar por CPF')}
          {renderFilterButton('card', 'Buscar por Cartão')}
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            {getSearchIcon()}
            <TextInput
              style={styles.searchInput}
              placeholder={getSearchPlaceholder()}
              placeholderTextColor="#99a1af"
              value={searchText}
              onChangeText={setSearchText}
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
            disabled={!searchText.trim()}
          >
            <Text
              style={[
                styles.searchButtonText,
                searchText.trim()
                  ? styles.searchButtonTextActive
                  : styles.searchButtonTextInactive,
              ]}
            >
              Buscar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Alert */}
        <View style={styles.alertContainer}>
          <DocumentIcon width={20} height={20} color="#1c398e" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Informação</Text>
            <Text style={styles.alertDescription}>
              Digite o {activeSearchType === 'cpf' ? 'CPF' : 'número do cartão'}{' '}
              do cliente para consultar o saldo disponível e informações do
              cartão.
            </Text>
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          {foundCards.length > 0 ? (
            <FlatList
              data={foundCards}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cardsList}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 12,
    paddingTop: 24,
    gap: 16,
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
})

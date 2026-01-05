import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import CreditCardIcon from 'src/assets/credit-card'
import { LogOutIcon } from 'src/assets/log-out-icon'
import { CardAuthBottomSheet } from 'src/components/card-auth-bottom-sheet'
import { CreditCard } from 'src/components/credit-card'
import { Header } from 'src/components/header'
import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
import { ResponseGetAllCardsUser } from 'src/services/cards/responses-dto'
import { colors } from 'src/theme/colors'

type RootStackParamList = {
  tabs: undefined
  login: undefined
  cards: undefined
}

type CardsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'cards'
>

export function Cards() {
  const { user, logout } = useAuth()
  const { getUserCards, isCardAuthenticated, selectCard, selectedCard } =
    useCard()

  const [cards, setCards] = useState<ResponseGetAllCardsUser>([])
  const [showBottomSheet, setShowBottomSheet] = useState(false)

  const navigation = useNavigation<CardsScreenNavigationProp>()

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const userCards = await getUserCards()
        setCards(userCards)
      } catch (error) {
        console.error('Erro ao buscar cartões do usuário:', error)
      }
    }

    fetchCards()
  }, []) // Removido getUserCards da dependência

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    if (isCardAuthenticated) {
      // Cartão autenticado - StackRoutes irá detectar automaticamente
    }
  }, [isCardAuthenticated])

  if (user?.role !== 'PORTATOR') {
    return (
      <View style={styles.container}>
        <Header
          icon={<CreditCardIcon />}
          title="Cartões"
          rightButton={
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <LogOutIcon width={18} height={18} color="#2b9909" />
            </TouchableOpacity>
          }
        />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Apenas portadores podem acessar cartões
          </Text>
        </View>
      </View>
    )
  }

  const handleCardSelect = (card: any) => {
    // Converter para o formato do contexto
    const cardToSelect = {
      id: card.id,
      cardNumber: card.cardNumber,
      cardholderName: card.name,
      balance: 0,
      creditLimit: 0,
      type: 'credit' as const,
      isActive: true,
      closingDate: 0,
      dueDate: 0,
      period: '',
      creditReturnDate: 0,
      estimatedBilling: 0,
      bills: [],
    }

    // Verifica se é o mesmo cartão já autenticado
    if (selectedCard && selectedCard.id === card.id && isCardAuthenticated) {
      Alert.alert(
        'Cartão já autenticado',
        'Este cartão já está autenticado e pronto para uso!',
        [{ text: 'OK' }]
      )
      return
    }

    selectCard(cardToSelect)
    setShowBottomSheet(true)
  }

  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false)
  }

  const renderCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleCardSelect(item)}
    >
      <CreditCard
        cardNumber={item.cardNumber}
        cardOwner={item.name}
        cardType={item.type === 'credit' ? 'Crédito' : 'Débito'}
      />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Header
        icon={<CreditCardIcon strokeColor={colors.primaryText} opacity={1} />}
        title="Selecione um cartão"
        rightButton={
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: 'transparent' }]}
          >
            <LogOutIcon width={24} height={24} color={colors.red[500]} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Cartões cadastrados</Text>
          <Text style={styles.subtitle}>
            {cards.length}{' '}
            {cards.length === 1 ? 'cartão cadastrado' : 'cartões cadastrados'}
          </Text>
        </View>

        {cards.length > 0 ? (
          <>
            <FlatList
              data={cards}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cardsList}
            />

            {/* Botão de navegação */}
            <TouchableOpacity
              style={[
                styles.navigationButton,
                (!selectedCard || !isCardAuthenticated) &&
                  styles.navigationButtonDisabled,
              ]}
              onPress={() => navigation.navigate('tabs')}
              disabled={!selectedCard || !isCardAuthenticated}
            >
              <Text
                style={[
                  styles.navigationButtonText,
                  (!selectedCard || !isCardAuthenticated) &&
                    styles.navigationButtonTextDisabled,
                ]}
              >
                {selectedCard && isCardAuthenticated
                  ? 'Acessar Dashboard'
                  : selectedCard
                  ? 'Autentique o cartão para continuar'
                  : 'Selecione um cartão'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum cartão cadastrado</Text>
          </View>
        )}
      </View>

      <CardAuthBottomSheet
        isVisible={showBottomSheet}
        selectedCard={selectedCard}
        onClose={handleCloseBottomSheet}
      />
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
    paddingInline: 28,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primary,
  },
  cardsList: {
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 8,
    tintColor: '#ec44ef',
  },
  navigationButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtonDisabled: {
    backgroundColor: colors.secondaryText,
    opacity: 0.5,
  },
  navigationButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtonTextDisabled: {
    color: colors.background,
    opacity: 0.7,
  },
})

import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import {
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
import { CreditCard as CreditCardType, useCard } from 'src/contexts/use-card'
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
  const { getUserCards, isCardAuthenticated } = useCard()
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [cardForAuth, setCardForAuth] = useState<CreditCardType | null>(null)
  const navigation = useNavigation<CardsScreenNavigationProp>()

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    if (isCardAuthenticated) {
      // Navigate to the main tabs screen after successful card authentication
      navigation.reset({
        index: 0,
        routes: [{ name: 'tabs' }],
      })
    }
  }, [isCardAuthenticated, navigation])

  if (user?.userType !== 'client') {
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
            Apenas clientes podem acessar cartões
          </Text>
        </View>
      </View>
    )
  }

  const userCards = getUserCards(user.id)

  const handleCardSelect = (card: CreditCardType) => {
    setCardForAuth(card)
    setShowBottomSheet(true)
  }

  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false)
    setCardForAuth(null)
  }

  const renderCard = ({ item }: { item: CreditCardType }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleCardSelect(item)}
    >
      <CreditCard
        cardNumber={item.cardNumber}
        cardOwner={item.cardholderName}
        cardVality={item.expiryDate}
        cardAssociation={item.brand.toUpperCase()}
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
            {userCards.length}{' '}
            {userCards.length === 1
              ? 'cartão cadastrado'
              : 'cartões cadastrados'}
          </Text>
        </View>

        {userCards.length > 0 ? (
          <FlatList
            data={userCards}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cardsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhum cartão cadastrado</Text>
          </View>
        )}
      </View>

      <CardAuthBottomSheet
        isVisible={showBottomSheet}
        selectedCard={cardForAuth}
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
})

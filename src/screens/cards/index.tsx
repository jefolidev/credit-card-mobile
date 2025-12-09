import { useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import CreditCardIcon from 'src/assets/credit-card'
import { CardAuthBottomSheet } from 'src/components/card-auth-bottom-sheet'
import { CreditCard } from 'src/components/credit-card'
import { Header } from 'src/components/header'
import { useAuth } from 'src/contexts/use-auth'
import { CreditCard as CreditCardType, useCard } from 'src/contexts/use-card'
import { colors } from 'src/theme/colors'

export function Cards() {
  const { user } = useAuth()
  const { getUserCards } = useCard()
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [cardForAuth, setCardForAuth] = useState<CreditCardType | null>(null)

  if (user?.userType !== 'client') {
    return (
      <View style={styles.container}>
        <Header icon={<CreditCardIcon />} title="Cartões" />
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
})

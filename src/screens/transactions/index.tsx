import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import { Header } from 'src/components/header'
import MonthlyBillCard from 'src/components/monthly-bill-card'
import { Bill, useCard } from 'src/contexts/use-card'
import { colors } from 'src/theme/colors'

export function Transactions() {
  const { selectedCard, isCardAuthenticated, getCardBillings } = useCard()
  const navigation = useNavigation<any>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadBills = async () => {
      if (isCardAuthenticated && selectedCard && !isLoading) {
        setIsLoading(true)
        try {
          await getCardBillings()
        } catch (error) {
          console.error('📄 Erro ao carregar bills do cartão:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadBills()
  }, [isCardAuthenticated, selectedCard?.id])

  if (!selectedCard) {
    return (
      <View style={styles.container}>
        <Header icon={<DocumentIcon />} title="Fechamentos" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Selecione um cartão para ver as faturas
          </Text>
        </View>
      </View>
    )
  }

  const bills = selectedCard?.bills || []

  const renderBill = ({ item }: { item: Bill }) => (
    <MonthlyBillCard
      month={item.month}
      year={item.year}
      amount={item.amount}
      dueDate={item.dueDate}
      closingDate={item.closingDate}
      status={item.status}
      onPress={() => navigation.navigate('BillDetails', { billId: item.id })}
    />
  )

  return (
    <View style={styles.container}>
      <Header
        icon={
          <DocumentIcon width={20} height={20} color={colors.primaryText} />
        }
        title="Fechamentos"
      />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.cardTitle}>
            {selectedCard.cardNumber
              .padStart(16, '0')
              .replace(/(.{4})/g, '$1 ')
              .trim()}
          </Text>
          <Text style={styles.subtitle}>
            Histórico de faturas do seu cartão
          </Text>
        </View>

        {bills.length > 0 ? (
          <FlatList
            data={bills}
            renderItem={renderBill}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.billsList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyBills}>
            <DocumentIcon width={48} height={48} color={colors.gray[300]} />
            <Text style={styles.emptyBillsTitle}>
              Nenhuma fatura encontrada
            </Text>
            <Text style={styles.emptyBillsText}>
              As faturas aparecerão aqui conforme forem sendo geradas
            </Text>
          </View>
        )}
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  billsList: {
    paddingBottom: 32,
  },
  separator: {
    height: 16,
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
  emptyBills: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  emptyBillsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    textAlign: 'center',
  },
  emptyBillsText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
})

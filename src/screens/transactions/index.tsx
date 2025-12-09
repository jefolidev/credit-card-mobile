import { FlatList, StyleSheet, Text, View } from 'react-native'
import DocumentIcon from 'src/assets/document-icon'
import { Header } from 'src/components/header'
import { TransactionItem } from 'src/components/transaction-item'
import { useCard } from 'src/contexts/use-card'
import { colors } from 'src/theme/colors'

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: 'credit' | 'debit'
  category: string
}

// Mock de transações
const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Supermercado Extra',
    amount: -125.5,
    date: '2024-12-09',
    type: 'debit',
    category: 'Alimentação',
  },
  {
    id: '2',
    description: 'Pagamento Recebido',
    amount: 500.0,
    date: '2024-12-08',
    type: 'credit',
    category: 'Transferência',
  },
  {
    id: '3',
    description: 'Shopping Center',
    amount: -89.9,
    date: '2024-12-07',
    type: 'debit',
    category: 'Compras',
  },
  {
    id: '4',
    description: 'Posto de Gasolina',
    amount: -75.0,
    date: '2024-12-06',
    type: 'debit',
    category: 'Combustível',
  },
  {
    id: '5',
    description: 'Netflix',
    amount: -45.9,
    date: '2024-12-05',
    type: 'debit',
    category: 'Assinatura',
  },
]

export function Transactions() {
  const { selectedCard } = useCard()

  if (!selectedCard) {
    return (
      <View style={styles.container}>
        <Header icon={<DocumentIcon />} title="Extrato" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Selecione um cartão para ver o extrato
          </Text>
        </View>
      </View>
    )
  }

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      title="a"
      type="credit"
      description={item.description}
      amount={item.amount}
      date={item.date}
      category={item.category}
    />
  )

  return (
    <View style={styles.container}>
      <Header
        icon={
          <DocumentIcon width={20} height={20} color={colors.primaryText} />
        }
        title="Extrato"
      />

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>
          Cartão **** {selectedCard.cardNumber.slice(-4)}
        </Text>
        <Text style={styles.balance}>
          Saldo: R${' '}
          {selectedCard.balance.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Últimas Transações</Text>

        <FlatList
          data={mockTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsList}
        />
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
    padding: 16,
  },
  cardInfo: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 16,
  },
  transactionsList: {
    paddingBottom: 20,
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

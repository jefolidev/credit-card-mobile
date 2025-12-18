import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { HomeIcon } from 'src/assets/home-icon'
import { BillInfoCard } from 'src/components/bill-info-card'
import { CashAmount } from 'src/components/cash-amount'
import { Header } from 'src/components/header'
import TransactionItem from 'src/components/transaction-item'
import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
import { colors } from '../../theme/colors'

export function Home() {
  const { user, logout } = useAuth()
  const { selectedCard, logoutCard, getTransactions, getBills } = useCard()

  // Get current month transactions
  const getCurrentMonthTransactions = () => {
    if (!selectedCard) return []

    const bills = getBills(selectedCard.id)
    const currentBill = bills.find((bill) => bill.status === 'current')

    if (!currentBill) return []

    return getTransactions(currentBill.id)
  }

  const currentTransactions = getCurrentMonthTransactions()

  // Group transactions by date
  const transactionsByDate = currentTransactions.reduce((acc, transaction) => {
    const date = transaction.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(transaction)
    return acc
  }, {} as Record<string, typeof currentTransactions>)

  // Sort dates in descending order and get latest 3 transactions
  const sortedDates = Object.keys(transactionsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  const formatDateLegend = (dateString: string) => {
    const date = new Date(dateString)
    return date
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(' de ', ' ')
  }

  // Get latest transactions with date grouping (limit to show max 2 dates for home screen)
  const limitedDates = sortedDates.slice(0, 2)

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        icon={<HomeIcon width={20} height={20} color={colors.primaryText} />}
        title="Resumo"
      />

      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingInline: 24, paddingBlock: 12, gap: 20 }}>
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Inter_600SemiBold',
                color: colors.primaryText,
              }}
            >
              Olá, {user?.name || user?.cpf}!
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_400Regular',
                color: colors.secondaryText,
                marginTop: 4,
              }}
            >
              Bem-vindo de volta!
            </Text>
          </View>

          {/* Informações do Cartão para Clientes */}
          {user?.userType === 'client' && selectedCard && (
            <>
              <CashAmount
                amount={selectedCard.balance}
                creditLimit={selectedCard.creditLimit}
                cardNumber={`Cartão •••• ${selectedCard.cardNumber.slice(-4)}`}
              />

              <View style={styles.infoContiner}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <BillInfoCard
                    title="Próximo Fechamento"
                    info={`Dia ${selectedCard.closingDate}`}
                  />
                  <BillInfoCard
                    title="Competência"
                    info={selectedCard.period}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <BillInfoCard
                    title="Retorno de Crédito"
                    info={`Dia ${selectedCard.creditReturnDate}`}
                  />
                  <BillInfoCard
                    title="Faturamento Previsto"
                    info={selectedCard.estimatedBilling.toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      }
                    )}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Inter_700Bold',
                    color: colors.primaryText,
                    marginBottom: 10,
                    fontWeight: 700,
                  }}
                >
                  Últimas Transações
                </Text>

                <Text style={{ color: colors.primary }}>Ver todas</Text>
              </View>

              <View style={styles.transactionsList}>
                {limitedDates.length > 0 ? (
                  limitedDates.map((date) => (
                    <View key={date} style={styles.transactionWrapper}>
                      <Text style={styles.dateLegend}>
                        {formatDateLegend(date)}
                      </Text>
                      {transactionsByDate[date].map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          title={transaction.title}
                          amount={transaction.amount}
                          date={transaction.date}
                          type={transaction.type}
                        />
                      ))}
                    </View>
                  ))
                ) : (
                  <Text
                    style={{
                      color: colors.secondaryText,
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    Nenhuma transação encontrada
                  </Text>
                )}
              </View>
            </>
          )}

          {/* Informações para Fornecedores */}
          {user?.userType === 'supplier' && (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Inter_600SemiBold',
                  color: colors.primaryText,
                  marginBottom: 10,
                }}
              >
                Painel do Fornecedor
              </Text>

              <BillInfoCard
                title="Vendas do Mês"
                info="R$ 12.580,00"
                type="discount"
              />
              <BillInfoCard title="Próximo Pagamento" info="Dia 30" />
              <BillInfoCard
                title="Comissão Disponível"
                info="R$ 1.258,00"
                type="discount"
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  cardSummary: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  creditLimit: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  infoContiner: {
    gap: 12,
  },
  transactionsList: {},
  transactionWrapper: {
    gap: 12,
    marginBottom: 20,
  },
  dateLegend: {
    color: colors.zinc[300],
    fontSize: 16,
  },
})

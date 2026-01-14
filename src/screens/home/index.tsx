import { useEffect, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { HomeIcon } from 'src/assets/home-icon'
import { BillInfoCard } from 'src/components/bill-info-card'
import { CashAmount } from 'src/components/cash-amount'
import { Header } from 'src/components/header'
import TransactionItem from 'src/components/transaction-item'
import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
import { formatCardNumber } from 'src/utils'
import { colors } from '../../theme/colors'

export function Home() {
  const { user, logout } = useAuth()
  const {
    selectedCard,
    isCardAuthenticated,
    getPortatorBalance,
    getCardBillings,
    getBillingDetails,
  } = useCard()

  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<
    any[]
  >([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const monthMap: { [key: string]: number } = {
    JAN: 0,
    FEV: 1,
    MAR: 2,
    ABR: 3,
    MAI: 4,
    JUN: 5,
    JUL: 6,
    AGO: 7,
    SET: 8,
    OUT: 9,
    NOV: 10,
    DEZ: 11,
  }

  const formatMonthYear = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`
  }

  const formatDateLegend = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem'
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })
    }
  }

  const loadCurrentMonthTransactions = async () => {
    if (!selectedCard || !selectedCard.bills || !isCardAuthenticated) {
      console.log('🔍 Condições não atendidas:', {
        selectedCard: !!selectedCard,
        bills: !!selectedCard?.bills,
        isCardAuthenticated,
      })
      return
    }

    setLoadingTransactions(true)
    try {
      const currentMonth = formatMonthYear(new Date())

      const currentBill = selectedCard.bills.find((bill) => {
        const monthNumber = monthMap[bill.month]
        if (monthNumber === undefined) {
          console.log('🔍 Mês desconhecido:', bill.month)
          return false
        }

        const billMonth = formatMonthYear(new Date(bill.year, monthNumber))

        return billMonth === currentMonth
      })

      if (currentBill) {
        const billDetails = await getBillingDetails(currentBill.id)

        if (billDetails && billDetails.sellInstallments) {
          const formattedTransactions = billDetails.sellInstallments.map(
            (installment: any) => {
              // Padronizar formato de data
              const dueDate = new Date(installment.dueDate)

              return {
                id: `${installment.sell.id}-${installment.installmentNumber}`,
                title: installment.sell.shop.name,
                description: installment.sell.description,
                amount: installment.amount,
                date: dueDate.toISOString(),
                type: 'payment' as const,
                installmentInfo: `${installment.installmentNumber}/${installment.sell.installments}`,
              }
            }
          )

          const sortedTransactions = formattedTransactions
            .sort((a, b) => {
              const dateA = new Date(a.date).getTime()
              const dateB = new Date(b.date).getTime()
              return dateB - dateA
            })
            .slice(0, 5)

          setCurrentMonthTransactions(sortedTransactions)
        } else {
          console.log('🔍 Sem parcelas na fatura')
          setCurrentMonthTransactions([])
        }
      } else {
        setCurrentMonthTransactions([])
      }
    } catch (error) {
      console.error('Erro ao buscar transações do mês:', error)
      setCurrentMonthTransactions([])
    } finally {
      setLoadingTransactions(false)
    }
  }

  useEffect(() => {
    const loadCardData = async () => {
      if (isCardAuthenticated && selectedCard) {
        try {
          await getPortatorBalance()
          await getCardBillings()
        } catch (error) {
          console.error('💰 Erro ao carregar dados do cartão:', error)
        }
      }
    }

    loadCardData()
  }, [isCardAuthenticated, selectedCard?.id])

  useEffect(() => {
    if (
      isCardAuthenticated &&
      selectedCard?.bills &&
      selectedCard.bills.length > 0
    ) {
      loadCurrentMonthTransactions()
    }
  }, [selectedCard?.bills])

  const transactionsByDate = currentMonthTransactions.reduce(
    (acc, transaction) => {
      if (!transaction.date) {
        console.warn('Transaction sem data encontrada:', transaction)
        return acc
      }

      // Usar a mesma lógica de data para agrupamento e exibição
      const dateObj = new Date(transaction.date)
      const date = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`

      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(transaction)
      return acc
    },
    {} as Record<string, typeof currentMonthTransactions>
  )

  const sortedDates = Object.keys(transactionsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  const limitedDates = sortedDates.slice(0, 2)

  const onRefresh = async () => {
    if (!isCardAuthenticated || !selectedCard) return

    setRefreshing(true)
    try {
      // Recarregar dados do cartão
      await getPortatorBalance()
      await getCardBillings()

      // Recarregar transações
      await loadCurrentMonthTransactions()

      console.log('🔄 Dados recarregados com sucesso')
    } catch (error) {
      console.error('🔄 Erro ao recarregar dados:', error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        icon={<HomeIcon width={20} height={20} color={colors.primaryText} />}
        title="Resumo"
      />

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={'#007AFF'}
          />
        }
      >
        <View style={{ paddingInline: 24, paddingBlock: 12, gap: 20 }}>
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Inter_600SemiBold',
                color: colors.primaryText,
              }}
            >
              Olá, {user?.name}!
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

          {/* Informações do Cartão para PORTADORES com cartão selecionado */}
          {user?.role === 'PORTATOR' && selectedCard ? (
            <>
              <CashAmount
                amount={selectedCard.limitAvailable}
                creditLimit={selectedCard.totalLimit}
                cardNumber={formatCardNumber(selectedCard.cardNumber)}
              />

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
              </View>

              <View style={styles.transactionsList}>
                {loadingTransactions ? (
                  <Text
                    style={{
                      color: colors.secondaryText,
                      textAlign: 'center',
                      padding: 20,
                    }}
                  >
                    Carregando transações...
                  </Text>
                ) : limitedDates.length > 0 ? (
                  limitedDates.map((date) => (
                    <View key={date} style={styles.transactionWrapper}>
                      <Text style={styles.dateLegend}>
                        {formatDateLegend(transactionsByDate[date][0].date)}
                      </Text>
                      {transactionsByDate[date].map((transaction: any) => (
                        <TransactionItem
                          key={transaction.id}
                          title={transaction.title}
                          description={transaction.description}
                          amount={transaction.amount}
                          date={transaction.date}
                          type={'transfer' as const}
                          installmentInfo={transaction.installmentInfo}
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
                    Nenhuma transação encontrada este mês
                  </Text>
                )}
              </View>
            </>
          ) : user?.role === 'PORTATOR' ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.secondaryText,
                  textAlign: 'center',
                }}
              >
                Selecione um cartão para ver seu resumo financeiro
              </Text>
            </View>
          ) : null}

          {/* Informações para Lojistas */}
          {user?.role === 'SELLER' && (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Inter_600SemiBold',
                  color: colors.primaryText,
                  marginBottom: 10,
                }}
              >
                Painel do Lojista
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
  totalLimit: {
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

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import { BillInfoCard } from 'src/components/bill-info-card'
import { CashAmount } from 'src/components/cash-amount'
import { Header } from 'src/components/header'
import TransactionItem from 'src/components/transaction-item'
import { useCard } from 'src/contexts/use-card'
import { ResponseGetBillingDetails } from 'src/services/cards/responses-dto'
import { colors } from 'src/theme/colors'

type RootStackParamList = {
  BillDetails: { billId: string }
}

type BillDetailsScreenRouteProp = RouteProp<RootStackParamList, 'BillDetails'>
type BillDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BillDetails'
>

export function BillDetails() {
  const route = useRoute<BillDetailsScreenRouteProp>()
  const navigation = useNavigation<BillDetailsScreenNavigationProp>()
  const { billId } = route.params
  const { selectedCard, getCardBillings, getBillingDetails } = useCard()
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadBillDetails = async () => {
      if (billId) {
        setIsLoading(true)
        try {
          const response: ResponseGetBillingDetails = await getBillingDetails(
            billId
          )
          console.log('🧾 Detalhes da fatura carregados:', response)

          if (response && response.sellInstallments) {
            const formattedTransactions = response.sellInstallments.map(
              (installment) => {
                const formatDate = (date: Date | string) => {
                  const dateObj = date instanceof Date ? date : new Date(date)
                  return dateObj.toISOString().split('T')[0]
                }

                return {
                  id: `${installment.sell.id}-${installment.installmentNumber}`,
                  title: installment.sell.shop.name,
                  description: `${installment.sell.description}`,
                  amount: installment.amount,
                  date: formatDate(installment.dueDate),
                  type: 'payment' as const,
                  installmentInfo: `${installment.installmentNumber}/${installment.sell.installments}`,
                  installmentNumber: installment.installmentNumber,
                  totalInstallments: installment.sell.installments,
                  shopName: installment.sell.shop.name,
                  shopCnpj: installment.sell.shop.cnpj,
                }
              }
            )

            setTransactions(formattedTransactions)
          } else {
            setTransactions([])
          }
        } catch (error) {
          console.error('🧾 Erro ao carregar detalhes da fatura:', error)
          setTransactions([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadBillDetails()
  }, [billId, getBillingDetails])

  if (!selectedCard) {
    navigation.goBack()
    return null
  }

  const bills = selectedCard?.bills || []
  const bill = bills.find((b) => b.id === billId)

  if (!bill) {
    navigation.goBack()
    return null
  }

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const transactionsByDate = transactions.reduce(
    (acc: Record<string, any[]>, transaction: any) => {
      const date = transaction.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(transaction)
      return acc
    },
    {} as Record<string, typeof transactions>
  )
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

  return (
    <View style={styles.container}>
      <Header
        icon={
          <DocumentIcon width={20} height={20} color={colors.primaryText} />
        }
        title="Detalhes da Fatura"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {/* Bill Info */}
        <View style={styles.billInfoSection}>
          <Text style={styles.sectionTitle}>Informações da Fatura</Text>

          <CashAmount
            iconType="credit-card"
            amount={bill.amount}
            cardType="bill"
            dueDate={new Date(bill.dueDate)}
          />

          <View style={{ marginBlock: 12 }}>
            <BillInfoCard
              type="discount"
              title="Desconto em folha"
              info={bill.amount.toString()}
            />
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <BillInfoCard
                title="Restante do Limite"
                info={formatAmount(selectedCard.balance - bill.amount)}
              />
              <BillInfoCard
                title="Fechamento"
                info={new Date(bill.closingDate).toLocaleDateString('pt-BR')}
              />
            </View>
            <View style={styles.infoRow}>
              <BillInfoCard
                title="Vencimento"
                info={new Date(bill.dueDate).toLocaleDateString('pt-BR')}
              />
              <BillInfoCard
                title="Subsídios disponíveis"
                info={formatAmount(bill.amount * 0.15)}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Transações do Período</Text>
        <View style={styles.transactionsList}>
          {sortedDates.map((date) => (
            <View key={date} style={styles.transactionWrapper}>
              <Text style={styles.dateLegend}>{formatDateLegend(date)}</Text>
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
          ))}
        </View>
      </ScrollView>
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

  warningCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  billInfoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 20,
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  infoGrid: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  paymentSection: {
    paddingBottom: 32,
  },
  payButton: {
    marginTop: 16,
  },
  transactionWrapper: {
    gap: 12,
    marginBottom: 20,
  },
  dateLegend: {
    color: colors.zinc[400],
    fontSize: 16,
  },
  transactionsList: {
    marginBlock: 1,
  },
})

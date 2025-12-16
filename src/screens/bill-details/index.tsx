import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { CheckIcon } from 'src/assets/check-icon'
import { DocumentIcon } from 'src/assets/document-icon'
import { ExclamationIcon } from 'src/assets/exclamation-icon'
import { BillInfoCard } from 'src/components/bill-info-card'
import { CashAmount } from 'src/components/cash-amount'
import { Header } from 'src/components/header'
import TransactionItem from 'src/components/transaction-item'
import { useCard } from 'src/contexts/use-card'
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
  const { selectedCard, getBills, getTransactions } = useCard()

  if (!selectedCard) {
    navigation.goBack()
    return null
  }

  const bills = getBills(selectedCard.id)
  const bill = bills.find((b) => b.id === billId)

  if (!bill) {
    navigation.goBack()
    return null
  }

  const getStatusConfig = () => {
    switch (bill.status) {
      case 'paid':
        return {
          icon: (
            <CheckIcon width={20} height={20} color={colors.emerald[600]} />
          ),
          title: 'Fatura Paga',
          subtitle: 'Esta fatura foi paga com sucesso',
          backgroundColor: colors.emerald[50],
          borderColor: colors.emerald[200],
          textColor: colors.emerald[700],
          showWarning: false,
        }
      case 'current':
        return {
          icon: (
            <ExclamationIcon
              width={20}
              height={20}
              color={colors.orange[600]}
            />
          ),
          title: 'Fatura Pendente',
          subtitle: 'Aguardando pagamento',
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[200],
          textColor: colors.orange[700],
          showWarning: true,
          warningText:
            'Não esqueça de pagar sua fatura até a data de vencimento para evitar juros e multa.',
        }
      case 'overdue':
        return {
          icon: (
            <ExclamationIcon width={20} height={20} color={colors.red[600]} />
          ),
          title: 'Fatura Atrasada',
          subtitle: 'Vencimento em atraso',
          backgroundColor: colors.red[50],
          borderColor: colors.red[200],
          textColor: colors.red[700],
          showWarning: true,
          warningText:
            'Esta fatura está em atraso. Pague o quanto antes para evitar o acúmulo de juros e multa.',
        }
      default:
        return {
          icon: (
            <ExclamationIcon
              width={20}
              height={20}
              color={colors.orange[600]}
            />
          ),
          title: 'Fatura',
          subtitle: '',
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[200],
          textColor: colors.orange[700],
          showWarning: false,
        }
    }
  }

  const statusConfig = getStatusConfig()

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Get transactions from context
  const billTransactions = getTransactions(billId)

  // Group transactions by date
  const transactionsByDate = billTransactions.reduce((acc, transaction) => {
    const date = transaction.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(transaction)
    return acc
  }, {} as Record<string, typeof billTransactions>) // Sort dates in descending order
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

  const handlePayBill = () => {
    Alert.alert(
      'Pagar Fatura',
      `Confirma o pagamento da fatura no valor de ${formatAmount(
        bill.amount
      )}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert('Sucesso', 'Fatura paga com sucesso!')
            navigation.goBack()
          },
        },
      ]
    )
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
        {/* Status Card */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: statusConfig.backgroundColor,
              borderColor: statusConfig.borderColor,
            },
          ]}
        >
          <View style={styles.statusHeader}>
            {statusConfig.icon}
            <View style={styles.statusTexts}>
              <Text
                style={[styles.statusTitle, { color: statusConfig.textColor }]}
              >
                {statusConfig.title}
              </Text>
              <Text style={styles.statusSubtitle}>{statusConfig.subtitle}</Text>
            </View>
          </View>
        </View>

        {/* Warning Card */}
        {statusConfig.showWarning && (
          <View
            style={[
              styles.warningCard,
              bill.status === 'overdue'
                ? {
                    backgroundColor: colors.red[50],
                    borderColor: colors.red[200],
                  }
                : {
                    backgroundColor: colors.orange[50],
                    borderColor: colors.orange[200],
                  },
            ]}
          >
            <View style={styles.warningHeader}>
              {bill.status === 'overdue' ? (
                <ExclamationIcon
                  width={16}
                  height={16}
                  color={colors.red[600]}
                />
              ) : (
                <ExclamationIcon
                  width={16}
                  height={16}
                  color={colors.orange[600]}
                />
              )}
              <Text
                style={[
                  styles.warningText,
                  {
                    color:
                      bill.status === 'overdue'
                        ? colors.red[700]
                        : colors.orange[700],
                  },
                ]}
              >
                {statusConfig.warningText}
              </Text>
            </View>
          </View>
        )}

        {/* Bill Info */}
        <View style={styles.billInfoSection}>
          <Text style={styles.sectionTitle}>Informações da Fatura</Text>

          <CashAmount
            iconType="credit-card"
            billStatus={bill.status}
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
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTexts: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
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

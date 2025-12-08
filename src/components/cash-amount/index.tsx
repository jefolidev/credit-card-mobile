import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, View } from 'react-native'
import CreditCardIcon from 'src/assets/credit-card'
import { useAmountVisibility } from 'src/contexts/use-amount-visibility'
import colors from 'src/theme/colors'
import { ButtonIcon } from '../button-icon'
import { Dot } from '../dot'

const FICTITIOUS_VALUE = 200000

type IconType = 'arrow-up' | 'credit-card'
type CardType = 'balance' | 'bill'
type BillStatus = 'overdue' | 'current' | 'paid'

interface CashAmountProps {
  iconType?: IconType
  cardType?: CardType
  billStatus?: BillStatus
  dueDate?: Date
  title?: string
  cardNumber?: string
}

export function CashAmount({
  iconType = 'credit-card',
  cardType = 'balance',
  billStatus = 'current',
  dueDate,
  title = 'Crédito Disponível',
  cardNumber = 'Cartão 6050 **** **** 1543',
}: CashAmountProps) {
  const { handleSetAmountVisibility, eyeState, isVisible } =
    useAmountVisibility()

  const isOverdue = () => {
    if (cardType === 'bill' && dueDate) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const dueDateOnly = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate()
      )
      return today > dueDateOnly
    }
    return false
  }

  const getActualBillStatus = (): BillStatus => {
    if (cardType === 'bill') {
      if (isOverdue()) return 'overdue'
      return billStatus
    }
    return billStatus
  }

  const getGradientColors = (): [string, string, string] => {
    if (cardType === 'bill' && isOverdue()) {
      return ['#E53E3E', '#C53030', '#9B2C2C']
    }
    return ['#773CBD', '#550DD1', '#4E03D5']
  }

  const getBillStatusLabel = () => {
    const actualStatus = getActualBillStatus()
    const statusLabels = {
      overdue: 'ATRASADA',
      current: 'ATUAL',
      paid: 'PAGA',
    }
    return statusLabels[actualStatus]
  }

  const formatDueDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={cardStyles.container}
    >
      <View style={cardStyles.backgroundIcon}>
        <CreditCardIcon width={180} height={180} opacity={0.4} />
      </View>
      <View
        style={[
          {
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
          { zIndex: 1 },
        ]}
      >
        <Text style={cardStyles.header}>
          {cardType === 'bill' ? 'Valor Total da Fatura' : title}
        </Text>
        {cardType === 'bill' ? (
          <View style={cardStyles.billStatusContainer}>
            <Text style={cardStyles.billStatusText}>
              {getBillStatusLabel()}
            </Text>
          </View>
        ) : (
          <ButtonIcon
            icon={eyeState}
            onPress={() => handleSetAmountVisibility()}
            isClickable
          />
        )}
      </View>

      <View style={{ zIndex: 1 }}>
        <View
          style={
            isVisible || cardType === 'bill'
              ? cardStyles.cashierVisibleContainer
              : cardStyles.cashierInvisibleAmount
          }
        >
          {isVisible || cardType === 'bill' ? (
            <Text style={cardStyles.cashierVisibleAmount}>
              {FICTITIOUS_VALUE.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
          ) : (
            Array(5)
              .fill(0)
              .map((_, index) => <Dot key={index} style={cardStyles.dots} />)
          )}
        </View>

        {cardType === 'bill' ? (
          <>
            <Text style={cardStyles.dueDateText}>
              Vencimento:{' '}
              <Text style={cardStyles.dueDateHighlight}>
                {dueDate ? formatDueDate(dueDate) : '--/--/----'}
              </Text>
            </Text>
            {isOverdue() && (
              <>
                <View style={cardStyles.separator} />
                <Text style={cardStyles.footerText}>
                  Multa e juros podem ser aplicados
                </Text>
              </>
            )}
          </>
        ) : (
          <Text style={cardStyles.header}>{cardNumber}</Text>
        )}
      </View>
    </LinearGradient>
  )
}

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryGradient,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 170,
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundIcon: {
    position: 'absolute',
    top: -10,
    right: 35,
    zIndex: 0,
  },
  header: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 14,
    color: colors.zinc[100],
    textTransform: 'uppercase',
  },
  cashierVisibleContainer: {
    minHeight: 34,
  },
  cashierVisibleAmount: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 28,
    color: colors.background,
  },
  cashierInvisibleAmount: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 34,
  },
  dots: {
    padding: 6,
  },
  billStatusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  billStatusText: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 12,
    color: colors.background,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 12,
  },
  dueDateText: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 14,
    color: colors.zinc[100],
    textTransform: 'uppercase',
  },
  dueDateHighlight: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 13,
    color: colors.background,
    fontWeight: 'bold',
  },
  footerText: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 13,
    color: colors.zinc[50],
    marginTop: 4,
    opacity: 0.8,
  },
})

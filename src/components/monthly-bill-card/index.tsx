import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ChevronRightIcon from 'src/assets/chevron-right-icon'
import DocumentIcon from 'src/assets/document-icon'
import colors from 'src/theme/colors'

type BillStatus = 'pending' | 'paid' | 'overdue'

interface MonthlyBillCardProps {
  month: string
  year: number
  amount: number
  dueDate: string
  closingDate: string
  status: BillStatus
  onPress?: () => void
}

export function MonthlyBillCard({
  month,
  year,
  amount,
  dueDate,
  closingDate,
  status,
  onPress,
}: MonthlyBillCardProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[200],
          textColor: colors.orange[700],
          label: 'Pendente',
        }
      case 'paid':
        return {
          backgroundColor: colors.emerald[50],
          borderColor: colors.emerald[200],
          textColor: colors.emerald[700],
          label: 'Paga',
        }
      case 'overdue':
        return {
          backgroundColor: colors.red[50],
          borderColor: colors.red[200],
          textColor: colors.red[700],
          label: 'Atrasada',
        }
      default:
        return {
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[200],
          textColor: colors.orange[700],
          label: 'Pendente',
        }
    }
  }

  const statusStyles = getStatusStyles()

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <DocumentIcon width={20} height={20} color={colors.primary} />
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.monthText}>
              {month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()}/
              {year}
            </Text>
            <Text style={styles.closingDate}>Fechamento {closingDate}</Text>
          </View>
        </View>
        <ChevronRightIcon color={colors.zinc[400]} />
      </View>

      <View style={styles.footer}>
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Valor total</Text>
          <Text style={styles.amount}>{formatAmount(amount)}</Text>
        </View>
        <View style={styles.rightSection}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyles.backgroundColor,
                borderColor: statusStyles.borderColor,
              },
            ]}
          >
            <Text
              style={[styles.statusText, { color: statusStyles.textColor }]}
            >
              {statusStyles.label}
            </Text>
          </View>
          <Text style={styles.dueDate}>Venc.: {dueDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    padding: 20,
    backgroundColor: colors.primary + '15', // 20% opacity
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    gap: 2,
  },
  monthText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    letterSpacing: 0.2,
  },
  closingDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.zinc[400],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountSection: {
    gap: 2,
  },
  amountLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.zinc[400],
  },
  amount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    fontWeight: '400',
    color: colors.primaryText,
    lineHeight: 28,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dueDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: colors.zinc[400],
  },
})

export default MonthlyBillCard

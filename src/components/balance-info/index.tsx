import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ClockIcon } from 'src/assets/clock-icon'
import { DollarIcon } from 'src/assets/dollar-icon'

interface BalanceData {
  totalLimit: number
  availableBalance: number
  usedBalance: number
  dueDate: string
}

interface BalanceInfoProps {
  balance: BalanceData
}

export function BalanceInfo({ balance }: BalanceInfoProps) {
  const utilizationPercentage = (balance.usedBalance / balance.totalLimit) * 100

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <View style={styles.container}>
      {/* Balance Information Card */}
      <View style={styles.balanceCard}>
        {/* Header */}
        <View style={styles.balanceHeader}>
          <View style={styles.iconContainer}>
            <DollarIcon width={20} height={20} color="#9810fa" />
          </View>
          <Text style={styles.balanceTitle}>Informações de Saldo</Text>
        </View>

        {/* Balance Details */}
        <View style={styles.balanceDetails}>
          {/* Total Limit */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Limite Total</Text>
            <Text style={styles.balanceValue}>
              {formatCurrency(balance.totalLimit)}
            </Text>
          </View>

          {/* Available Balance */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Saldo Disponível</Text>
            <Text style={[styles.balanceValue, styles.availableValue]}>
              {formatCurrency(balance.availableBalance)}
            </Text>
          </View>

          {/* Used Balance */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Saldo Utilizado</Text>
            <Text style={[styles.balanceValue, styles.usedValue]}>
              {formatCurrency(balance.usedBalance)}
            </Text>
          </View>

          {/* Due Date */}
          <View style={[styles.balanceRow, styles.lastRow]}>
            <Text style={styles.balanceLabel}>Vencimento da Fatura</Text>
            <View style={styles.dueDateContainer}>
              <ClockIcon width={16} height={16} strokeColor="#101828" />
              <Text style={styles.balanceValue}>{balance.dueDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Utilization Card */}
      <View style={styles.utilizationCard}>
        <Text style={styles.utilizationTitle}>Utilização do Limite</Text>

        <View style={styles.utilizationContainer}>
          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(utilizationPercentage, 100)}%` },
              ]}
            />
          </View>

          {/* Percentage Text */}
          <Text style={styles.utilizationText}>
            {utilizationPercentage.toFixed(1)}% utilizado
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderWidth: 1.25,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 17.25,
    gap: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f3e8ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
  },
  balanceDetails: {
    gap: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1.25,
    borderBottomColor: '#f3f4f6',
    height: 48,
  },
  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#4a5565',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  balanceValue: {
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
  },
  availableValue: {
    color: '#00a63e',
  },
  usedValue: {
    color: '#e7000b',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  utilizationCard: {
    backgroundColor: 'white',
    borderWidth: 1.25,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 17.25,
    gap: 12,
  },
  utilizationTitle: {
    fontSize: 14,
    color: '#364153',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  utilizationContainer: {
    gap: 8,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  utilizationText: {
    fontSize: 12,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
    textAlign: 'center',
  },
})

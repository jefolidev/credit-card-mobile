import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CancelIcon } from 'src/assets/cancel-icon'
import { CheckIcon } from 'src/assets/check-icon'
import ClockIcon from 'src/assets/clock-icon'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import { formatCardNumber } from 'src/utils'

export type SaleStatus = 'PAID' | 'IN_CANCELATION' | 'CANCELED'

export interface SaleItemProps {
  id: string
  customerName: string
  cardNumber: string
  amount: number
  installments?: number
  date: string
  status: SaleStatus
}

const getStatusConfig = (status: SaleStatus) => {
  switch (status) {
    case 'PAID':
      return {
        backgroundColor: '#dcfce7',
        borderColor: '#b9f8cf',
        icon: <CheckIcon width={16} height={16} color="#008236" />,
        text: 'Autorizada',
        textColor: '#008236',
      }
    case 'CANCELED':
      return {
        backgroundColor: '#ffe2e2',
        borderColor: '#ffc9c9',
        icon: <CancelIcon width={16} height={16} color="#c10007" />,
        text: 'Cancelada',
        textColor: '#c10007',
      }
    case 'IN_CANCELATION':
      return {
        backgroundColor: '#f3f4f6',
        borderColor: '#e5e7eb',
        icon: <ClockIcon width={16} height={16} strokeColor="#364153" />,
        text: 'Em cancelamento',
        textColor: '#364153',
      }
  }
}

export function SaleItem({
  id,
  customerName,
  cardNumber,
  amount,
  installments,
  date,
  status,
}: SaleItemProps) {
  const statusConfig = getStatusConfig(status)

  return (
    <View style={[styles.container, { borderColor: statusConfig.borderColor }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.id}>ID: {id}</Text>
          <Text style={styles.customerName}>{customerName}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.backgroundColor },
          ]}
        >
          {statusConfig.icon}
          <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <CreditCardIcon width={16} height={16} color="#364153" />
          <Text style={styles.detailText}>{formatCardNumber(cardNumber)}</Text>
        </View>

        <View style={styles.detailRow}>
          <DollarIcon width={16} height={16} color="#364153" />
          <View style={styles.amountContainer}>
            <Text style={styles.detailText}>
              {amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Text>
            {installments && installments > 1 && (
              <Text style={styles.installmentText}>em {installments}x</Text>
            )}
          </View>
        </View>

        <View style={styles.detailRow}>
          <ClockIcon width={16} height={16} strokeColor="#364153" />
          <Text style={styles.detailText}>{date}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1.45,
    borderRadius: 14,
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 48,
  },
  headerLeft: {
    flex: 1,
    gap: 10,
  },
  id: {
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  customerName: {
    fontSize: 12,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
  },
  details: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#364153',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  installmentText: {
    fontSize: 14,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
})

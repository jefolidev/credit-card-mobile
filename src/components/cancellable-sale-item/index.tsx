import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CheckIcon } from 'src/assets/check-icon'
import ClockIcon from 'src/assets/clock-icon'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import { UserIcon } from 'src/assets/user-icon'

export interface CancellableSaleItemProps {
  id: string
  customerName: string
  cardNumber: string
  amount: number
  installments?: number
  date: string
  nsu: string
  authCode: string
  status: 'authorized' | 'cancelled'
  cancellationReason?: string
  onCancel: () => void
}

export function CancellableSaleItem({
  id,
  customerName,
  cardNumber,
  amount,
  installments,
  date,
  nsu,
  authCode,
  status,
  cancellationReason,
  onCancel,
}: CancellableSaleItemProps) {
  const isDisabled = status === 'cancelled'

  return (
    <View style={[styles.container, isDisabled && styles.disabledContainer]}>
      <View style={styles.header}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: status === 'authorized' ? '#dcfce7' : '#f3f4f6',
            },
          ]}
        >
          {status === 'authorized' ? (
            <CheckIcon width={14} height={14} color="#008236" />
          ) : (
            <ClockIcon width={14} height={14} strokeColor="#364153" />
          )}
          <Text
            style={[
              styles.statusText,
              { color: status === 'authorized' ? '#008236' : '#364153' },
            ]}
          >
            {status === 'authorized' ? 'Autorizada' : 'Cancelada'}
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <ClockIcon width={14} height={14} strokeColor="#6a7282" />
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <CreditCardIcon width={16} height={16} color="#101828" />
          <Text style={styles.detailText}>{cardNumber}</Text>
        </View>

        <View style={styles.detailRow}>
          <UserIcon width={16} height={16} color="#4a5565" />
          <Text style={[styles.detailText, { color: '#4a5565' }]}>
            {customerName}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <DollarIcon width={16} height={16} color="#101828" />
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
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
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NSU:</Text>
          <Text style={styles.infoValue}>{nsu}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Código Auth:</Text>
          <Text style={styles.infoValue}>{authCode}</Text>
        </View>
        {status === 'cancelled' && cancellationReason && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Motivo:</Text>
            <Text style={[styles.infoValue, styles.cancellationReasonText]}>
              {cancellationReason}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.cancelButton, isDisabled && styles.disabledCancelButton]}
        onPress={onCancel}
        disabled={isDisabled}
      >
        <Text style={styles.cancelButtonText}>Cancelar Venda</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1.483,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 17.483,
    gap: 12,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountText: {
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
  },
  installmentText: {
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
  },
  infoContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
  },
  infoValue: {
    fontSize: 12,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
  },
  cancellationReasonText: {
    color: '#dc2626',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#e7000b',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledCancelButton: {
    backgroundColor: '#d1d5dc',
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
})

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CheckIcon } from 'src/assets/check-icon'
import ClockIcon from 'src/assets/clock-icon'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import { UserIcon } from 'src/assets/user-icon'
import { StatusSell } from 'src/services/sells/enum/status-sell-enum'
import { formatCardNumber } from 'src/utils'

// Função para traduzir motivos de cancelamento
const translateCancelReason = (reason: string): string => {
  const reasonMap: Record<string, string> = {
    'HOLDER_REQUEST': 'Solicitação do portador',
    'DUPLICATE_TRANSACTION': 'Transação duplicada',
    'INCORRECT_AMOUNT': 'Valor incorreto',
    'INCORRECT_CARD': 'Cartão incorreto',
    'OTHER_REASON': 'Outro motivo',
  }
  return reasonMap[reason] || reason
}

// Função para formatar data no formato HH:mm, DD/MM/YYYY
const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  
  return `${hours}:${minutes}, ${day}/${month}/${year}`
}

export interface CancellableSaleItemProps {
  id: string
  customerName: string
  cardNumber: string
  amount: number
  installments?: number
  date: string | Date
  authCode: string
  status: StatusSell
  cancelReason?: string
  canceledAt?: string | Date | null
  onCancel: () => void
}

export function CancellableSaleItem({
  id,
  customerName,
  cardNumber,
  amount,
  installments,
  date,
  authCode,
  status,
  cancelReason,
  canceledAt,
  onCancel,
}: CancellableSaleItemProps) {
  const isDisabled = status === 'CANCELED' || status === 'IN_CANCELATION'

  const getStatusConfig = () => {
    switch (status) {
      case 'PAID':
        return {
          backgroundColor: '#dcfce7',
          color: '#008236',
          text: 'Autorizada',
          icon: <CheckIcon width={14} height={14} color="#008236" />,
        }
      case 'IN_CANCELATION':
        return {
          backgroundColor: '#fef3c7',
          color: '#d97706',
          text: 'Em cancelamento',
          icon: <ClockIcon width={14} height={14} strokeColor="#d97706" />,
        }
      case 'CANCELED':
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#364153',
          text: 'Cancelada',
          icon: <ClockIcon width={14} height={14} strokeColor="#364153" />,
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <View style={[styles.container, isDisabled && styles.disabledContainer]}>
      <View style={styles.header}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusConfig.backgroundColor,
            },
          ]}
        >
          {statusConfig.icon}
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <ClockIcon width={14} height={14} strokeColor="#6a7282" />
          <Text style={styles.dateText}>{formatDateTime(date)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <CreditCardIcon width={16} height={16} color="#101828" />
          <Text style={styles.detailText}>{formatCardNumber(cardNumber)}</Text>
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
        {(status === 'CANCELED' || status === 'IN_CANCELATION') &&
          cancelReason && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Motivo:</Text>
                <Text style={[styles.infoValue, styles.cancellationReasonText]}>
                  {translateCancelReason(cancelReason)}
                </Text>
              </View>
              {status === 'CANCELED' && canceledAt && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cancelado em:</Text>
                  <Text style={styles.infoValue}>
                    {formatDateTime(canceledAt)}
                  </Text>
                </View>
              )}
            </>
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

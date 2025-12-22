import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { CancelIcon } from 'src/assets/cancel-icon'
import { colors } from 'src/theme/colors'

interface SaleCancellationData {
  amount: number
  installments?: number
  cardNumber: string
  nsu: string
}

interface SaleCancellationSheetProps {
  visible: boolean
  saleData: SaleCancellationData
  onCancel: () => void
  onConfirm: (reason: string) => void
}

const cancellationReasons = [
  { label: 'Selecione o motivo', value: '' },
  { label: 'Solicitação do cliente', value: 'customer_request' },
  { label: 'Transação duplicada', value: 'duplicate_transaction' },
  { label: 'Valor incorreto', value: 'incorrect_amount' },
  { label: 'Cartão incorreto', value: 'incorrect_card' },
  { label: 'Outro motivo', value: 'other' },
]

export function SaleCancellationSheet({
  visible,
  saleData,
  onCancel,
  onConfirm,
}: SaleCancellationSheetProps) {
  const [selectedReason, setSelectedReason] = useState('')

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason)
      setSelectedReason('')
    }
  }

  const handleCancel = () => {
    setSelectedReason('')
    onCancel()
  }

  const getAmountText = () => {
    const baseAmount = saleData.amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    if (saleData.installments && saleData.installments > 1) {
      const installmentAmount = saleData.amount / saleData.installments
      return `${baseAmount} (${
        saleData.installments
      }x de ${installmentAmount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })})`
    }

    return baseAmount
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <CancelIcon width={32} height={32} color="#c10007" />
                </View>
                <Text style={styles.title}>Confirmar Cancelamento</Text>
                <Text style={styles.subtitle}>
                  Esta ação não poderá ser desfeita
                </Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* Sale Info */}
                <View style={styles.saleInfoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Valor:</Text>
                    <Text style={styles.infoValue}>{getAmountText()}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cartão:</Text>
                    <Text style={styles.infoValue}>{saleData.cardNumber}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>NSU:</Text>
                    <Text style={styles.infoValue}>{saleData.nsu}</Text>
                  </View>
                </View>

                {/* Reason Selection */}
                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>Motivo do Cancelamento</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedReason}
                      style={styles.picker}
                      onValueChange={setSelectedReason}
                    >
                      {cancellationReasons.map((reason) => (
                        <Picker.Item
                          key={reason.value}
                          label={reason.label}
                          value={reason.value}
                          enabled={reason.value !== ''}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>Voltar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      !selectedReason && styles.confirmButtonDisabled,
                    ]}
                    onPress={handleConfirm}
                    disabled={!selectedReason}
                  >
                    <Text
                      style={[
                        styles.confirmButtonText,
                        !selectedReason && styles.confirmButtonTextDisabled,
                      ]}
                    >
                      Confirmar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
    paddingBottom: 34, // Safe area bottom padding
  },
  header: {
    borderBottomWidth: 1.25,
    borderBottomColor: '#e5e7eb',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#ffe2e2',
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  saleInfoContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#4a5565',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  infoValue: {
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  reasonContainer: {
    gap: 8,
  },
  reasonLabel: {
    fontSize: 14,
    color: '#364153',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.25,
    borderColor: '#d1d5dc',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    height: 52,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.25,
    borderColor: '#d1d5dc',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#364153',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.red[500],
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#d1d5dc',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  confirmButtonTextDisabled: {
    color: 'white',
  },
})

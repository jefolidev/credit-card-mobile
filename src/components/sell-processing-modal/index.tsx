import React, { useEffect } from 'react'
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/theme/colors'
import { SuccessConfetti } from '../success-confetti'

type ProcessingState = 'loading' | 'success' | 'error' | 'idle'

interface SellProcessingModalProps {
  visible: boolean
  state: ProcessingState
  onComplete?: () => void
  errorMessage?: string
}

export function SellProcessingModal({
  visible,
  state,
  onComplete,
  errorMessage,
}: SellProcessingModalProps) {
  useEffect(() => {
    if (state === 'success') {
      // Auto close after 2 seconds
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 2000)
      return () => clearTimeout(timer)
    } else if (state === 'error') {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [state, onComplete])

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Processando venda...</Text>
            <Text style={styles.loadingSubtext}>
              Aguarde enquanto processamos sua transação
            </Text>
          </View>
        )

      case 'success':
        return (
          <View style={styles.successContainer}>
            <SuccessConfetti />
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.successText}>Venda Realizada!</Text>
            <Text style={styles.successSubtext}>
              Transação processada com sucesso
            </Text>
          </View>
        )

      case 'error':
        return (
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorMark}>✕</Text>
            </View>
            <Text style={styles.errorText}>Erro na Transação</Text>
            <Text style={styles.errorSubtext}>
              {errorMessage || 'Não foi possível processar a venda'}
            </Text>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>{renderContent()}</View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    maxWidth: 320,
    width: '90%',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorMark: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
})

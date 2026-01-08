import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { EyeIcon } from 'src/assets/eye-simple'
import { BalanceInfo } from 'src/components/balance-info'
import { applyCpfMask } from 'src/utils'

interface CardData {
  id: string
  cardNumber: string
  holderName: string
  cpf: string
  cardType: string
  status: 'active' | 'inactive'
  balance: {
    totalLimit: number
    availableBalance: number
    usedBalance: number
    dueDate: string
  }
}

interface CreditCardDisplayProps {
  card: CardData
  onPress: () => void
  isExpanded?: boolean
}

export function CreditCardDisplay({
  card,
  onPress,
  isExpanded = false,
}: CreditCardDisplayProps) {
  const getStatusBadgeColor = () => {
    switch (card.status) {
      case 'active':
        return {
          backgroundColor: 'white',
          textColor: '#008236',
        }
      case 'inactive':
        return {
          backgroundColor: '#f3f4f6',
          textColor: '#364153',
        }
      default:
        return {
          backgroundColor: 'white',
          textColor: '#008236',
        }
    }
  }

  const statusColors = getStatusBadgeColor()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        {/* Background Decoration */}
        <View style={styles.backgroundDecoration}>
          <View style={styles.decorationShape} />
        </View>

        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors.backgroundColor },
              ]}
            >
              <Text
                style={[styles.statusText, { color: statusColors.textColor }]}
              >
                {card.status === 'active' ? 'Ativo' : 'Inativo'}
              </Text>
            </View>
            <TouchableOpacity style={styles.eyeButton}>
              <EyeIcon width={16} height={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Card Type */}
          <Text style={styles.cardType}>{card.cardType}</Text>

          {/* Card Number */}
          <Text style={styles.cardNumber}>{card.cardNumber}</Text>

          {/* Holder Name */}
          <Text style={styles.holderName}>{card.holderName}</Text>

          {/* CPF */}
          <Text style={styles.cpf}>CPF: {applyCpfMask(card.cpf)}</Text>
        </View>
      </TouchableOpacity>

      {/* Balance Information */}
      {isExpanded && <BalanceInfo balance={card.balance} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  cardContainer: {
    height: 196,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    // Gradient background equivalent
    backgroundColor: '#773cbd',
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    opacity: 0.1,
  },
  decorationShape: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 64,
  },
  cardContent: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
  },
  statusBadge: {
    height: 24,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
  },
  eyeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 12,
    color: '#e9d4ff',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
    height: 16,
  },
  cardNumber: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    letterSpacing: 0.8,
    height: 24,
  },
  holderName: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
    height: 20,
  },
  cpf: {
    fontSize: 12,
    color: '#e9d4ff',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 16,
    height: 16,
  },
})

import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TriangleDownIcon from 'src/assets/triangle-down-icon'
import TriangleUpIcon from 'src/assets/triangle-up-icon'
import colors from 'src/theme/colors'

type TransactionType = 'debit' | 'credit' | 'payment' | 'transfer'

interface TransactionItemProps {
  title: string
  description: string
  amount: number
  date: Date
  type: TransactionType
  category?: string
  onPress?: () => void
}

export function TransactionItem({
  title,
  description,
  amount,
  date,
  type,
  category,
  onPress,
}: TransactionItemProps) {
  const getIconAndColor = () => {
    switch (type) {
      case 'credit':
      case 'payment':
        return {
          icon: TriangleUpIcon,
          iconColor: colors.emerald[400],
          backgroundColor: colors.emerald[50],
          amountColor: colors.emerald[500],
        }
      case 'debit':
      case 'transfer':
      default:
        return {
          icon: TriangleDownIcon,
          iconColor: colors.red[500],
          backgroundColor: colors.red[50],
          amountColor: colors.red[500],
        }
    }
  }

  const formatAmount = (value: number) => {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value))

    if (type === 'debit' || type === 'transfer') {
      return `- ${formattedValue}`
    } else if (type === 'credit' || type === 'payment') {
      return `+ ${formattedValue}`
    }
    return formattedValue
  }

  const iconAndColor = getIconAndColor()
  const IconComponent = iconAndColor.icon

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconAndColor.backgroundColor },
        ]}
      >
        <IconComponent width={14} height={14} color={iconAndColor.iconColor} />
      </View>

      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.amount, { color: iconAndColor.amountColor }]}>
            {formatAmount(amount)}
          </Text>
        </View>

        <View style={styles.secondaryInfo}>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          <Text style={styles.date}>
            {new Date(date)
              .toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
              })
              .replace(' de ', ' ')
              .replace(
                /^(\d+)\s(\w)/,
                (match, day, firstLetter) =>
                  `${day} ${firstLetter.toUpperCase()}`
              )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.primaryText,
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },
  secondaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.gray[300],
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.gray[400],
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.gray[400],
  },
})

export default TransactionItem

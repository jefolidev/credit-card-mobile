import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ArrowDownIcon } from 'src/assets/arrow-down'
import colors from 'src/theme/colors'

interface BillInfoCardProps {
  title: string
  info: string
  icon?: React.ReactNode
  type?: 'default' | 'discount'
}

export function BillInfoCard({
  title,
  info,
  icon,
  type = 'default',
}: BillInfoCardProps) {
  const isDiscount = type === 'discount'

  const formatDiscountValue = (value: string) => {
    if (!isDiscount) return value

    // Remove any existing currency symbols and parse as number
    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''))

    if (isNaN(numericValue)) return value

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(numericValue))
  }

  const renderIcon = () => {
    if (isDiscount) {
      return <ArrowDownIcon height={28} width={28} color={colors.primary} />
    }

    if (!icon) return null

    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        color: colors.primary,
        width: 20,
        height: 20,
      } as any)
    }

    return icon
  }

  return (
    <View style={styles.container}>
      <View style={{ gap: 6, paddingBlock: 3 }}>
        <Text style={[styles.title, isDiscount && styles.discounTitle]}>
          {title}
        </Text>
        <Text style={[styles.info, isDiscount && styles.discountInfo]}>
          {formatDiscountValue(info)}
        </Text>
      </View>
      {(icon || isDiscount) && (
        <View style={styles.iconContainer}>{renderIcon()}</View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingBlock: 24,
    paddingInline: 20,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter_400Regular',
    flexWrap: 'wrap',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  info: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.primaryText,
  },
  discounTitle: {
    color: colors.primary,
    fontSize: 18,
  },
  discountInfo: {
    color: colors.primary,
    fontSize: 24,
  },
  iconContainer: {
    padding: 18,
    borderRadius: 28,
    marginLeft: 12,
    backgroundColor: colors.primary + '10',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CheckIcon from 'src/assets/check-icon'
import ExclamationIcon from 'src/assets/exclamation-icon'
import colors from 'src/theme/colors'

type BannerVariant = 'warning' | 'destructive' | 'success'

interface BannerProps {
  variant?: BannerVariant
  message: string
  title?: string
}

export function Banner({ variant = 'warning', message, title }: BannerProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[200],
          iconColor: colors.orange[600],
          textColor: colors.orange[800],
          titleColor: colors.orange[900],
          IconComponent: ExclamationIcon,
        }
      case 'destructive':
        return {
          backgroundColor: colors.red[50],
          borderColor: colors.red[200],
          iconColor: colors.red[600],
          textColor: colors.red[800],
          titleColor: colors.red[900],
          IconComponent: ExclamationIcon,
        }
      case 'success':
        return {
          backgroundColor: colors.emerald[50],
          borderColor: colors.emerald[200],
          iconColor: colors.emerald[600],
          textColor: colors.emerald[800],
          titleColor: colors.emerald[900],
          IconComponent: CheckIcon,
        }
      default:
        return {
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[200],
          iconColor: colors.orange[600],
          textColor: colors.orange[800],
          titleColor: colors.orange[900],
          IconComponent: ExclamationIcon,
        }
    }
  }

  const variantStyles = getVariantStyles()
  const { IconComponent } = variantStyles

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          alignItems: 'center',
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <IconComponent color={variantStyles.iconColor} width={20} height={20} />
      </View>

      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, { color: variantStyles.titleColor }]}>
            {title}
          </Text>
        )}
        <Text style={[styles.message, { color: variantStyles.textColor }]}>
          {message}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
})

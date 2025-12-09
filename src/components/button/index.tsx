import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { colors } from '../../theme/colors'

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary'
  children: string
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function Button({
  variant = 'primary',
  children,
  loading = false,
  size = 'medium',
  disabled,
  style,
  ...props
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[size],
    disabled && styles.disabled,
    style,
  ]

  const textStyle = [
    styles.text,
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ]

  if ((variant === 'primary' || variant === 'secondary') && !disabled) {
    const gradientColors =
      variant === 'primary'
        ? (['#773CBD', '#550DD1', '#4E03D5'] as const)
        : (['#FF8D28', '#F93332', '#CD086A'] as const)

    return (
      <TouchableOpacity
        {...props}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          styles.base,
          styles[size],
          variant === 'secondary' && styles.base,
          style,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            styles[size],
            variant === 'secondary' && styles.gradient,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={textStyle}>{children}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Estado disabled com gradiente cinza
  if (disabled) {
    return (
      <TouchableOpacity
        {...props}
        disabled={true}
        activeOpacity={1}
        style={[styles.base, styles[size], styles.disabled, style]}
      >
        <LinearGradient
          colors={['#e5e7eb', '#9ca3af', '#9ba3b3'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, styles[size]]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={textStyle}>{children}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={buttonStyle}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  disabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 32,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    minHeight: 52,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  smallText: {
    fontSize: 14,
    lineHeight: 20,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 24,
  },
  largeText: {
    fontSize: 18,
    lineHeight: 28,
  },
  disabledText: {
    color: colors.gray[500],
  },
})

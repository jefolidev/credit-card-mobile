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
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'success'
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
  const isGradient = variant === 'primary' || variant === 'secondary'

  // Variantes com gradiente (primary/secondary)
  if (isGradient) {
    const gradientColors =
      variant === 'primary'
        ? (['#773CBD', '#550DD1', '#4E03D5'] as const)
        : (['#FF8D28', '#F93332', '#CD086A'] as const)

    // Disabled para variantes com gradiente
    if (disabled) {
      return (
        <TouchableOpacity
          {...props}
          disabled={true}
          activeOpacity={1}
          style={[styles.base, styles.disabled, style]}
        >
          <LinearGradient
            colors={['#e5e7eb', '#9ca3af', '#9ba3b3'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.text}>{children}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        {...props}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[styles.base, style]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.text}>{children}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Variantes sólidas (success / destructive)
  if (variant === 'destructive' || variant === 'success') {
    const bg = variant === 'destructive' ? colors.red[600] : colors.emerald[600]
    const bgDisabled =
      variant === 'destructive' ? colors.red[300] : colors.emerald[300]

    return (
      <TouchableOpacity
        {...props}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.base,
          styles.solid,
          { backgroundColor: disabled ? bgDisabled : bg },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.text}>{children}</Text>
        )}
      </TouchableOpacity>
    )
  }

  // Variante outline
  if (variant === 'outline') {
    const containerStyle = [
      styles.base,
      styles.outline,
      disabled && styles.outlineDisabled,
      style,
    ]
    const textStyle = [
      styles.outlineText,
      disabled && styles.outlineTextDisabled,
    ]
    return (
      <TouchableOpacity
        {...props}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={containerStyle}
      >
        {loading ? (
          <ActivityIndicator
            color={disabled ? colors.gray[500] : colors.primary}
            size="small"
          />
        ) : (
          <Text style={textStyle}>{children}</Text>
        )}
      </TouchableOpacity>
    )
  }

  // Fallback (sem gradiente)
  const containerStyle = [styles.base, style]
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={containerStyle}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  gradient: {
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  solid: {
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 1000,
  },
  disabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  disabledText: {
    color: colors.gray[500],
  },
  outlineText: {
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    color: colors.zinc[700],
  },
  outlineTextDisabled: {
    color: colors.gray[500],
  },
  outlineDisabled: {
    borderColor: colors.gray[200],
  },
})

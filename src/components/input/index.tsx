import React from 'react'
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from '../../theme/colors'

interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconPress?: () => void
  onLeftIconPress?: () => void
  variant?: 'default' | 'filled'
}

export function Input({
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  variant = 'default',
  style,
  ...props
}: InputProps) {
  const containerStyle = [
    styles.container,
    variant === 'filled' && styles.filled,
    style,
  ]

  return (
    <View style={containerStyle}>
      {leftIcon && (
        <TouchableOpacity
          onPress={onLeftIconPress}
          style={styles.iconContainer}
          disabled={!onLeftIconPress}
          activeOpacity={onLeftIconPress ? 0.7 : 1}
        >
          {leftIcon}
        </TouchableOpacity>
      )}

      <TextInput
        style={[
          styles.input,
          leftIcon && styles.inputWithLeftIcon,
          rightIcon && styles.inputWithRightIcon,
        ]}
        placeholderTextColor={colors.gray[400]}
        {...props}
      />

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconContainer}
          disabled={!onRightIconPress}
          activeOpacity={onRightIconPress ? 0.7 : 1}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    minHeight: 48,
  },
  filled: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.primaryText,
    paddingVertical: 0,
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  iconContainer: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

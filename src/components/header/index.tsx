import React, { JSX } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native'
import { ArrowLeftIcon } from 'src/assets/arrow-left'
import { colors } from 'src/theme/colors'
import { ButtonIcon } from '../button-icon'
import { Title } from '../title'

interface HeaderProps extends ViewProps {
  icon?: JSX.Element | string
  title: string
  isIconClickable?: boolean
  onBackPress?: () => void
  showBackButton?: boolean
}

export function Header({
  icon,
  title,
  isIconClickable = false,
  onBackPress,
  showBackButton = false,
  ...rest
}: HeaderProps) {
  return (
    <View style={headerStyles.container} {...rest}>
      {showBackButton || onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={headerStyles.backButton}>
          <ArrowLeftIcon width={24} height={24} color={colors.primaryText} />
        </TouchableOpacity>
      ) : (
        <ButtonIcon icon={icon ?? <></>} isClickable={isIconClickable} />
      )}
      <Title>{title}</Title>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingBlockStart: 24,
    paddingBlockEnd: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
})

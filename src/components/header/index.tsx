import { JSX } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { ButtonIcon } from '../button-icon'
import { Title } from '../title'

interface HeaderProps extends ViewProps {
  icon: JSX.Element | string
  title: string
  isIconClickable?: boolean
}

export function Header({
  icon,
  title,
  isIconClickable = false,
  ...rest
}: HeaderProps) {
  return (
    <View style={headerStyles.container} {...rest}>
      <ButtonIcon icon={icon} isClickable={isIconClickable} />
      <Title>{title}</Title>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 24,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
})

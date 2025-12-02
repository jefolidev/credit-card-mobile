import { JSX } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

interface ButtonIconProps extends TouchableOpacityProps {
  isClickable?: boolean
  icon: JSX.Element | string
}

export function ButtonIcon({
  isClickable = true,
  icon,
  ...rest
}: ButtonIconProps) {
  const { style: restStyle, ...touchableProps } = rest as any
  delete touchableProps.icon
  delete touchableProps.children

  return (
    <TouchableOpacity
      {...touchableProps}
      disabled={!isClickable}
      activeOpacity={isClickable ? 0.7 : 1}
      style={[style.buttonIcon, restStyle]}
    >
      {icon}
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  buttonIcon: {
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

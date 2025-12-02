import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

interface ButtonIconProps extends TouchableOpacityProps {
  isClickable?: boolean
}

export function ButtonIcon({ isClickable = true, ...rest }: ButtonIconProps) {
  const { icon } = rest as any
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
      {icon ?? (rest as any).children}
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  buttonIcon: {},
})

import { StyleSheet, Text, TextProps } from 'react-native'
import { colors } from '../../theme/colors'

interface TitleProps extends TextProps {
  children: string
}

export function Title({ children, ...rest }: TitleProps) {
  return (
    <Text style={titleStyle.title} {...rest}>
      {children}
    </Text>
  )
}

const titleStyle = StyleSheet.create({
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
})

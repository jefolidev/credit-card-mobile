import { StyleProp, View, ViewStyle } from 'react-native'

export function Dot({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        { padding: 5, borderRadius: 1000, backgroundColor: 'white' },
        style,
      ]}
    />
  )
}

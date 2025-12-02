import { View } from 'react-native'
import CreditCartIcon from '../../assets/credit-card'
import { Title } from '../../components/title'
import SvgComponent from './teste'

export function Home() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <SvgComponent />
      <CreditCartIcon />
      <Title>Titulo foda</Title>
    </View>
  )
}

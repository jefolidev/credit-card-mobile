import { View } from 'react-native'
import CreditCardIcon from '../../assets/credit-card.svg'
import { ButtonIcon } from '../../components/button-icon'
import { Title } from '../../components/title'

export function Home() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <ButtonIcon>
        <CreditCardIcon width={20} height={20} />
      </ButtonIcon>
      <Title>Titulo foda</Title>
    </View>
  )
}

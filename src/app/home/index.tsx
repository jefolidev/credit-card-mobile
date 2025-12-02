import CreditCartIcon from '../../assets/credit-card'
import { Header } from '../../components/header'
import colors from '../../theme/colors'

export function Home() {
  const { primaryText } = colors

  return (
    <Header
      title="Titulo foda"
      icon={<CreditCartIcon width={22} height={22} strokeColor={primaryText} />}
    />
  )
}

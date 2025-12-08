import { View } from 'react-native'
import { Banner } from 'src/components/banner'
import CreditCardIcon from '../../assets/credit-card'
import { Header } from '../../components/header'
import colors from '../../theme/colors'

export function Home() {
  const { primaryText } = colors

  return (
    <View style={{ padding: 12, gap: 15 }}>
      <Header
        title="Titulo foda"
        icon={
          <CreditCardIcon width={22} height={22} strokeColor={primaryText} />
        }
      />
      // Warning (laranja)
      <Banner
        variant="warning"
        title="Atenção"
        message="Sua fatura vence em 3 dias"
      />
      // Destructive (vermelho)
      <Banner
        variant="destructive"
        title="Erro"
        message="Falha ao processar pagamento"
      />
      // Success (verde)
      <Banner
        variant="success"
        title="Sucesso"
        message="Pagamento realizado com sucesso"
      />
      // Apenas mensagem
      <Banner variant="warning" message="Verifique seus dados" />
      {/* <CreditCard
        cardNumber="6050 8000 6325 7286"
        cardOwner="Cleiton Campelo da Silva"
        cardVality="04/2020"
      />
      <CashAmount
        cardType="bill"
        iconType="arrow-up"
        dueDate={new Date(2026, 2, 15)}
      /> */}
    </View>
  )
}

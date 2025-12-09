import { ScrollView, Text, View } from 'react-native'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { HomeIcon } from 'src/assets/home-icon'
import { LogOutIcon } from 'src/assets/log-out-icon'
import { QrCodeIcon } from 'src/assets/qr-code-icon'
import { UserIcon } from 'src/assets/user-icon'
import { BillInfoCard } from 'src/components/bill-info-card'
import { NavigateBar } from 'src/components/navigate-bar'
import { colors } from '../../theme/colors'

export function Home() {
  const navigationItems = [
    {
      id: 'summary',
      label: 'Resumo',
      icon: <HomeIcon />,
      isActive: true,
      onPress: () => console.log('Summary pressed'),
    },
    {
      id: 'bills',
      label: 'Faturas',
      icon: <CreditCardIcon />,
      onPress: () => console.log('Bills pressed'),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <UserIcon />,
      onPress: () => console.log('Profile pressed'),
    },
    {
      id: 'logout',
      label: 'Sair',
      icon: <LogOutIcon />,
      onPress: () => console.log('Logout pressed'),
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 12, gap: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter_600SemiBold',
              color: colors.primaryText,
              marginBottom: 10,
            }}
          >
            Informações da Fatura
          </Text>

          <BillInfoCard title="Próximo Fechamento" info="Dia 15" />

          <BillInfoCard
            title="Desconto disponível"
            info="25.50"
            type="discount"
          />
        </View>
      </ScrollView>

      <NavigateBar
        items={navigationItems}
        qrCodeIcon={<QrCodeIcon width={28} height={28} />}
        onQrCodePress={() => console.log('QR Code pressed')}
      />
    </View>
  )
}

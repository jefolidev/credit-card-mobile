import { useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { HomeIcon } from 'src/assets/home-icon'
import { LogOutIcon } from 'src/assets/log-out-icon'
import { QrCodeIcon } from 'src/assets/qr-code-icon'
import { UserIcon } from 'src/assets/user-icon'
import { BillInfoCard } from 'src/components/bill-info-card'
import { Button } from 'src/components/button'
import { Input } from 'src/components/input'
import { NavigateBar } from 'src/components/navigate-bar'
import { RadioGroup } from 'src/components/radio'
import { useAuth } from 'src/contexts/use-auth'
import { colors } from '../../theme/colors'

export function Home() {
  const [selected, setSelected] = useState('1')
  const { user, logout } = useAuth()

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => logout(),
      },
    ])
  }

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
      onPress: handleLogout,
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <RadioGroup
        options={[
          { id: '1', label: 'Opção 1', icon: <HomeIcon /> },
          { id: '2', label: 'Opção 2', icon: <CreditCardIcon /> },
        ]}
        selectedId={selected}
        onSelect={setSelected}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 12, gap: 20 }}>
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Inter_600SemiBold',
                color: colors.primaryText,
              }}
            >
              Olá, {user?.name || user?.email}!
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter_400Regular',
                color: colors.secondaryText,
                marginTop: 4,
              }}
            >
              Tipo: {user?.userType === 'client' ? 'Cliente' : 'Fornecedor'}
            </Text>
          </View>

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

        <View style={{ gap: 12, paddingInline: 12 }}>
          <Input
            placeholder="seu@email.com"
            leftIcon={<CreditCardIcon />}
            rightIcon={<CreditCardIcon />}
          />
          <View style={{ paddingBlock: 8, height: 24 }}>
            <Button> OI</Button>
          </View>
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

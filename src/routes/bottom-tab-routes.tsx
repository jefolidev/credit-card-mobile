import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useState } from 'react'
import { View } from 'react-native'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import DocumentIcon from 'src/assets/document-icon'
import { HomeIcon } from 'src/assets/home-icon'
import { QrCodeIcon } from 'src/assets/qr-code-icon'
import { UserIcon } from 'src/assets/user-icon'
import { NavigateBar } from 'src/components/navigate-bar'
import { Cards } from 'src/screens/cards'
import { Home } from 'src/screens/home'
import { Profile } from 'src/screens/profile'
import { Transactions } from 'src/screens/transactions'

const Stack = createNativeStackNavigator()

export function BottomTabRoutes() {
  const [activeTab, setActiveTab] = useState('home')

  const navigationItems = [
    {
      id: 'home',
      label: 'Resumo',
      icon: <HomeIcon />,
      onPress: () => setActiveTab('home'),
    },
    {
      id: 'transactions',
      label: 'Extrato',
      icon: <DocumentIcon />,
      onPress: () => setActiveTab('transactions'),
    },
    {
      id: 'cards',
      label: 'Cartões',
      icon: <CreditCardIcon />,
      onPress: () => setActiveTab('cards'),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <UserIcon />,
      onPress: () => setActiveTab('profile'),
    },
  ]

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home />
      case 'transactions':
        return <Transactions />
      case 'cards':
        return <Cards />
      case 'profile':
        return <Profile />
      default:
        return <Home />
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <NavigateBar
        items={navigationItems}
        activeItemId={activeTab}
        qrCodeIcon={<QrCodeIcon width={28} height={28} />}
        onQrCodePress={() => console.log('QR Code pressed')}
      />
    </View>
  )
}

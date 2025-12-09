import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { JSX, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { DocumentIcon } from 'src/assets/document-icon'
import { HomeIcon } from 'src/assets/home-icon'
import { QrCodeIcon } from 'src/assets/qr-code-icon'
import { UserIcon } from 'src/assets/user-icon'

import { NavigateBar } from 'src/components/navigate-bar'
import { BillDetails } from 'src/screens/bill-details'
import { Cards } from 'src/screens/cards'
import { Home } from 'src/screens/home'
import { Profile } from 'src/screens/profile'
import { Transactions } from 'src/screens/transactions'

type BottomTabParams = 'home' | 'transactions' | 'cards' | 'profile'

const Stack = createNativeStackNavigator()

const TransactionsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TransactionsList" component={Transactions} />
      <Stack.Screen name="BillDetails" component={BillDetails} />
    </Stack.Navigator>
  )
}

export const BottomTabRoutes = (): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<BottomTabParams>('home')

  const navigationItems = [
    {
      id: 'home',
      label: 'Resumo',
      icon: <HomeIcon />,
      onPress: () => setCurrentTab('home'),
    },
    {
      id: 'transactions',
      label: 'Fechamentos',
      icon: <DocumentIcon />,
      onPress: () => setCurrentTab('transactions'),
    },
    {
      id: 'cards',
      label: 'Cartões',
      icon: <CreditCardIcon />,
      onPress: () => setCurrentTab('cards'),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <UserIcon />,
      onPress: () => setCurrentTab('profile'),
    },
  ]

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return <Home />
      case 'transactions':
        return <TransactionsStack />
      case 'cards':
        return <Cards />
      case 'profile':
        return <Profile />
      default:
        return <Home />
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>

      <NavigateBar
        currentTab={currentTab}
        onTabPress={setCurrentTab}
        items={navigationItems}
        activeItemId={currentTab}
        qrCodeIcon={<QrCodeIcon width={28} height={28} />}
        onQrCodePress={() => console.log('QR Code pressed')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})

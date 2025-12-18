import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { JSX, useCallback, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import { HomeIcon } from 'src/assets/home-icon'
import { LogOutIcon } from 'src/assets/log-out-icon'
import { QrCodeIcon } from 'src/assets/qr-code-icon'
import { UserIcon } from 'src/assets/user-icon'
import { NavigateBar } from 'src/components/navigate-bar'
import { useCard } from 'src/contexts/use-card'
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

export function BottomTabRoutes(): JSX.Element {
  const [currentTab, setCurrentTab] = useState<BottomTabParams>('home')
  const { logoutCard } = useCard()

  const handleExit = useCallback(() => {
    Alert.alert('Sair', 'Tem certeza que deseja sair para a tela de cartões?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: () => {
          logoutCard()
          setCurrentTab('cards')
        },
      },
    ])
  }, [logoutCard])

  const navigationItems = [
    {
      id: 'home',
      label: 'Resumo',
      icon: <HomeIcon />,
      onPress: () => setCurrentTab('home'),
    },
    {
      id: 'transactions',
      label: 'Faturas',
      icon: <DocumentIcon />,
      onPress: () => setCurrentTab('transactions'),
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <UserIcon />,
      onPress: () => setCurrentTab('profile'),
    },
    {
      id: 'exit',
      label: 'Sair',
      icon: <LogOutIcon />,
      onPress: handleExit,
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
      {currentTab !== 'cards' && (
        <NavigateBar
          currentTab={currentTab}
          onTabPress={setCurrentTab}
          items={navigationItems}
          activeItemId={currentTab}
          qrCodeIcon={<QrCodeIcon width={28} height={28} />}
          onQrCodePress={() => console.log('QR Code pressed')}
        />
      )}
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

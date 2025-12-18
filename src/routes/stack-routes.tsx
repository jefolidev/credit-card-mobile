import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
import { CardAuthenticationBottomSheet } from 'src/screens/card-authentication/components/card-authentication-bottom-sheet'
import { Cards } from 'src/screens/cards'
import { ProfileSac } from 'src/screens/contacts/PerfilSac'
import { Login } from 'src/screens/login'
import { BlockCardBottomSheet } from 'src/screens/profile/components/block-card-bottom-sheet'
import { ChangePasswordBottomSheet } from 'src/screens/profile/components/change-password-bottom-sheet'
import { SecondCardBottomSheet } from 'src/screens/profile/components/second-card-bottom-sheet'
import { SupplierDashboard } from 'src/screens/supplier-dashboard'
import { BottomTabRoutes } from './bottom-tab-routes'

const Stack = createNativeStackNavigator()

interface StackRoutesProps {
  isAuthenticated: boolean
}

export function StackRoutes({ isAuthenticated }: StackRoutesProps) {
  const { user } = useAuth()
  const { selectedCard, isCardAuthenticated } = useCard()

  if (!isAuthenticated) {
    return (
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={Login} />
      </Stack.Navigator>
    )
  }

  if (user?.userType === 'supplier') {
    return (
      <Stack.Navigator
        initialRouteName="supplierDashboard"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="supplierDashboard" component={SupplierDashboard} />
      </Stack.Navigator>
    )
  }

  // Para clientes: verifica se tem cartão selecionado e autenticado
  if (!selectedCard || !isCardAuthenticated) {
    return (
      <Stack.Navigator
        initialRouteName="cards"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="cards" component={Cards} />
      </Stack.Navigator>
    )
  }

  // Se tem cartão selecionado e autenticado, mostra as tabs
  return (
    <Stack.Navigator
      initialRouteName="tabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="tabs" component={BottomTabRoutes} />
      {/* Aux screens/modal sheets accessible from tabs */}
      <Stack.Screen name="Contacts" component={ProfileSac} />
      <Stack.Screen
        name="ChangePasswordBottomSheet"
        component={ChangePasswordBottomSheet}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen
        name="BlockCardBottomSheet"
        component={BlockCardBottomSheet}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen
        name="SecondCardBottomSheet"
        component={SecondCardBottomSheet}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen
        name="CardAuthenticationBottomSheet"
        component={CardAuthenticationBottomSheet}
        options={{ presentation: 'transparentModal' }}
      />
    </Stack.Navigator>
  )
}

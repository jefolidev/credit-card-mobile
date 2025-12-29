import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
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

  // Debug logs para verificar o estado da navegação

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

  if (user?.role === 'SELLER') {
    return (
      <Stack.Navigator
        initialRouteName="supplierDashboard"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="supplierDashboard" component={SupplierDashboard} />
      </Stack.Navigator>
    )
  }

  // PORTADOR precisa ter cartão selecionado E autenticado para ir ao home
  if (user?.role === 'PORTATOR') {
    if (!selectedCard) {
      return (
        <Stack.Navigator
          initialRouteName="cards"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="cards" component={Cards} />
        </Stack.Navigator>
      )
    }

    if (!isCardAuthenticated) {
      return (
        <Stack.Navigator
          initialRouteName="cards"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="cards" component={Cards} />
        </Stack.Navigator>
      )
    }

    // Cartão selecionado E autenticado = vai para home
  }

  // Se é PORTADOR com cartão autenticado, vai para as tabs (home com resumo)
  return (
    <Stack.Navigator
      initialRouteName="tabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="tabs" component={BottomTabRoutes} />
      <Stack.Screen name="cards" component={Cards} />
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
    </Stack.Navigator>
  )
}

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
import { Cards } from 'src/screens/cards'
import { Login } from 'src/screens/login'
import {
  AlterarSenhaBottomSheet,
  BloquearCartaoBottomSheet,
  SegundaViaBottomSheet,
} from 'src/screens/profile/bottom-sheets'
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
        initialRouteName="tabs"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="tabs" component={BottomTabRoutes} />
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
      <Stack.Screen
        name="Contacts"
        component={require('../screens/contacts').Contacts}
      />
      <Stack.Screen
        name="AlterarSenhaBottomSheet"
        component={AlterarSenhaBottomSheet}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen
        name="BloquearCartaoBottomSheet"
        component={BloquearCartaoBottomSheet}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen
        name="SegundaViaBottomSheet"
        component={SegundaViaBottomSheet}
        options={{ presentation: 'transparentModal' }}
      />
    </Stack.Navigator>
  )
}

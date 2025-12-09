import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
import { Cards } from 'src/screens/cards'
import { Login } from 'src/screens/login'
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
    </Stack.Navigator>
  )
}

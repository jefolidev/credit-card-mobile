import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from 'src/screens/home'
import { Login } from 'src/screens/login'

const Stack = createNativeStackNavigator()

interface StackRoutesProps {
  isAuthenticated: boolean
}

export function StackRoutes({ isAuthenticated }: StackRoutesProps) {
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'home' : 'login'}
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="home" component={Home} />
      ) : (
        <Stack.Screen name="login" component={Login} />
      )}
    </Stack.Navigator>
  )
}

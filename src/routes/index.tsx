import { NavigationContainer } from '@react-navigation/native'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from 'src/contexts/use-auth'
import { StackRoutes } from './stack-routes'

export function Routes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <StackRoutes isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  )
}

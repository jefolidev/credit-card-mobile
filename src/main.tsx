import { Arimo_400Regular, Arimo_700Bold } from '@expo-google-fonts/arimo'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'
import React from 'react'
import { AmountVisibilityProvider } from './contexts/use-amount-visibility'
import { Home } from './screens/home'

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Arimo_400Regular,
    Arimo_700Bold,
  })

  if (!fontsLoaded) return null

  return (
    // <LinearGradient
    //   colors={['#773CBD', '#550DD1', '#4E03D5']}
    //   start={{ x: 0.05, y: 0 }}
    //   end={{ x: 1, y: 1 }}
    //   style={styles.container}
    // >
    // </LinearGradient>
    <AmountVisibilityProvider>
      <Home />
    </AmountVisibilityProvider>
  )
}

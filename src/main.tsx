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
import { AuthProvider } from './contexts/use-auth'
import { CardProvider } from './contexts/use-card'
import { Routes } from './routes/@index'

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
    <AuthProvider>
      <CardProvider>
        <AmountVisibilityProvider>
          <Routes />
        </AmountVisibilityProvider>
      </CardProvider>
    </AuthProvider>
  )
}

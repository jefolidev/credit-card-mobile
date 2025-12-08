import { Arimo_400Regular, Arimo_700Bold } from '@expo-google-fonts/arimo'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'
import React from 'react'
import { StyleSheet } from 'react-native'
import { AmountVisibilityProvider } from './contexts/use-amount-visibility'
import { Home } from './screens/home'
import colors from './theme/colors'

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inter: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
    color: '#ffffff',
  },
  arimo: {
    fontFamily: 'Arimo_700Bold',
    fontSize: 18,
    color: '#ffffff',
  },
})

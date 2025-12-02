import { Arimo_400Regular, Arimo_700Bold } from '@expo-google-fonts/arimo'
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors from './theme/colors'

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Arimo_400Regular,
    Arimo_700Bold,
  })

  if (!fontsLoaded) return null

  return (
    <LinearGradient
      colors={["#773CBD", "#550DD1", "#4E03D5"]}
      start={{ x: 0.05, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.inter}>Inter — exemplo (600)</Text>
      <Text style={styles.arimo}>Arimo — exemplo (700)</Text>
      <StatusBar style="auto" />
    </LinearGradient>
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

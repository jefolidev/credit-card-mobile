import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

export function CardAuthentication() {
  const navigation = useNavigation()

  useEffect(() => {
    // Automaticamente navegar para o bottom sheet
    navigation.navigate('CardAuthenticationBottomSheet' as never)
  }, [navigation])

  // Esta tela não renderiza nada, apenas redireciona
  return null
}

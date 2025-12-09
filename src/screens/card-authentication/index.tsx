import { useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { LockIcon } from 'src/assets/lock-icon'
import { Button } from 'src/components/button'
import { Header } from 'src/components/header'
import { Input } from 'src/components/input'
import { useCard } from 'src/contexts/use-card'
import { colors } from 'src/theme/colors'

export function CardAuthentication() {
  const [password, setPassword] = useState('')
  const { selectedCard, authenticateCard, isCardLoading } = useCard()

  const handleAuthenticate = async () => {
    if (!selectedCard) {
      Alert.alert('Erro', 'Nenhum cartão selecionado')
      return
    }

    if (!password || password.length !== 6) {
      Alert.alert('Erro', 'Digite uma senha de 6 dígitos')
      return
    }

    try {
      const success = await authenticateCard(selectedCard.id, password)

      if (!success) {
        Alert.alert('Erro', 'Senha incorreta. Tente novamente.')
        setPassword('')
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante a autenticação')
      console.error('Erro na autenticação:', error)
    }
  }

  if (!selectedCard) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum cartão selecionado</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header icon={<LockIcon />} title="Autenticação do Cartão" />

      <View style={styles.content}>
        <View style={styles.cardInfo}>
          <CreditCardIcon width={48} height={48} />
          <Text style={styles.cardNumber}>
            **** **** **** {selectedCard.cardNumber.slice(-4)}
          </Text>
          <Text style={styles.cardHolder}>{selectedCard.cardholderName}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.instructionText}>
            Digite a senha de 6 dígitos do seu cartão
          </Text>

          <Input
            placeholder="******"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            leftIcon={<LockIcon />}
          />

          <Button
            onPress={handleAuthenticate}
            disabled={isCardLoading || password.length !== 6}
          >
            {isCardLoading ? 'Autenticando...' : 'Confirmar'}
          </Button>

          <Text style={styles.helpText}>
            Para teste, use as senhas:{'\n'}
            Cartão Visa: 123456{'\n'}
            Cartão Mastercard: 654321{'\n'}
            Cartão Elo: 111222
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  cardInfo: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
    marginTop: 12,
    letterSpacing: 2,
  },
  cardHolder: {
    fontSize: 16,
    color: colors.secondaryText,
    marginTop: 4,
  },
  formContainer: {
    gap: 16,
  },
  instructionText: {
    fontSize: 16,
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
  },
})

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from 'src/components'
import { CreditCardIcon } from '../../../../assets/credit-card-icon'
import { LockIcon } from '../../../../assets/lock-icon'
import { Button } from '../../../../components/button'
import { Input } from '../../../../components/input'
import { useCard } from '../../../../contexts/use-card'
import { colors } from '../../../../theme/colors'

export function CardAuthenticationBottomSheet() {
  const navigation = useNavigation()
  const [visible, setVisible] = useState(true)
  const [password, setPassword] = useState('')
  const { selectedCard, authenticateCard, isCardLoading } = useCard()

  useFocusEffect(
    useCallback(() => {
      setPassword('')
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )

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
      } else {
        setVisible(false)
        navigation.goBack()
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante a autenticação')
      console.error('Erro na autenticação:', error)
    }
  }

  const handleClose = () => {
    setVisible(false)
    navigation.goBack()
  }

  if (!selectedCard) {
    return (
      <BaseSheet
        visible={visible}
        title="Autenticação do Cartão"
        onClose={handleClose}
        footer={
          <View style={baseSheetStyles.actionsRow}>
            <Button
              style={baseSheetStyles.actionButton}
              variant="outline"
              onPress={handleClose}
            >
              Fechar
            </Button>
          </View>
        }
      >
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.secondaryText,
              textAlign: 'center',
            }}
          >
            Nenhum cartão selecionado
          </Text>
        </View>
      </BaseSheet>
    )
  }

  return (
    <BaseSheet
      visible={visible}
      title="Autenticação do Cartão"
      onClose={handleClose}
      footer={
        <View style={baseSheetStyles.actionsRow}>
          <Button
            style={baseSheetStyles.actionButton}
            variant="outline"
            onPress={handleClose}
          >
            Cancelar
          </Button>
          <Button
            style={baseSheetStyles.actionButton}
            onPress={handleAuthenticate}
            disabled={isCardLoading || password.length !== 6}
          >
            {isCardLoading ? 'Autenticando...' : 'Confirmar'}
          </Button>
        </View>
      }
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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

          <Text style={styles.helpText}>
            Para teste, use as senhas:{'\n'}
            Cartão Visa: 123456{'\n'}
            Cartão Mastercard: 654321{'\n'}
            Cartão Elo: 111222
          </Text>
        </View>
      </KeyboardAvoidingView>
    </BaseSheet>
  )
}

const styles = {
  cardInfo: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center' as const,
    marginBottom: 24,
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
    fontWeight: '600' as const,
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
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center' as const,
    marginTop: 16,
    lineHeight: 18,
  },
}

export default CardAuthenticationBottomSheet

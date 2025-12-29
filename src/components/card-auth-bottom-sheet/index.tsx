import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CreditCardIcon } from 'src/assets/credit-card-icon'
import { EyeIcon } from 'src/assets/eye-simple'
import { LockIcon } from 'src/assets/lock-icon'
import { Button } from 'src/components/button'
import { CreditCard } from 'src/components/credit-card'
import { Input } from 'src/components/input'
import { CreditCard as CreditCardType, useCard } from 'src/contexts/use-card'
import { colors } from 'src/theme/colors'
import { AuthCardBodySchema } from './schema'

interface CardAuthBottomSheetProps {
  isVisible: boolean
  selectedCard: CreditCardType | null
  onClose: () => void
}

const { height } = Dimensions.get('window')

export function CardAuthBottomSheet({
  isVisible,
  selectedCard,
  onClose,
}: CardAuthBottomSheetProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { authenticateCard, isCardLoading } = useCard()

  const { handleSubmit, setValue, watch } = useForm<AuthCardBodySchema>({
    defaultValues: {
      password: '',
    },
  })

  const password = watch('password')

  const handleAuthenticate = async () => {
    if (!selectedCard) {
      Alert.alert('Erro', 'Nenhum cartão selecionado')
      return
    }

    if (!password || password.length !== 4) {
      Alert.alert('Erro', 'Digite uma senha de 4 dígitos')
      return
    }

    try {
      const success = await authenticateCard(selectedCard.id, password)

      if (success) {
        console.log('🔍 DEBUG: Autenticação bem sucedida!')
        console.log('🔍 DEBUG: Fechando modal e navegando para dashboard...')
        onClose()
        setValue('password', '')
        setShowPassword(false)

        console.log(
          '✅ Cartão autenticado! StackRoutes irá re-renderizar e navegar para dashboard'
        )
      } else {
        Alert.alert('Erro', 'Senha incorreta. Tente novamente.')
        setValue('password', '')
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante a autenticação')
      console.error('Erro na autenticação:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleClose = () => {
    onClose()
    setValue('password', '')
    setShowPassword(false)
  }

  if (!selectedCard) {
    return null
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.bottomSheet}>
          {/* Header com indicador */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>Acesse seu cartão</Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Componente do Cartão */}
            <View style={styles.cardContainer}>
              <CreditCard
                cardNumber={selectedCard.cardNumber}
                cardOwner={selectedCard.cardholderName}
                cardType={selectedCard.type === 'credit' ? 'Crédito' : 'Débito'}
              />
            </View>

            {/* Formulário */}
            <View style={styles.formContainer}>
              {/* Campo do Número do Cartão (Desabilitado) */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Número do Cartão</Text>
                <View style={[styles.inputField, styles.disabledInput]}>
                  <View style={styles.disabledInputContent}>
                    <CreditCardIcon color="#6B7280" width={20} height={20} />
                    <Text style={styles.disabledText}>
                      {selectedCard.cardNumber}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Campo da Senha */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha do Cartão (4 dígitos)</Text>
                <Input
                  placeholder="Digite sua senha"
                  value={watch('password')}
                  onChangeText={(text) => setValue('password', text)}
                  secureTextEntry={!showPassword}
                  keyboardType="numeric"
                  maxLength={4}
                  leftIcon={<LockIcon />}
                  rightIcon={
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                      <EyeIcon closed={!showPassword} color="#99A1AF" />
                    </TouchableOpacity>
                  }
                  style={{ marginBottom: 12 }}
                />
              </View>

              {/* Botão de Entrar */}
              <Button
                onPress={handleSubmit(handleAuthenticate)}
                disabled={isCardLoading || watch('password').length !== 4}
                style={styles.authButton}
              >
                {isCardLoading ? 'Autenticando...' : 'Entrar'}
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.95,
    minHeight: height * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  cardContainer: {
    marginVertical: 32,
    width: '100%',
    paddingHorizontal: 12,
  },
  formContainer: {
    flex: 1,
    paddingBottom: 24,
    gap: 24,
  },
  inputContainer: {
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primaryText,
  },
  inputField: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  disabledInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  disabledText: {
    fontSize: 18,
    color: '#6B7280',
  },
  authButton: {
    height: 50,
    marginBlock: -12,
  },
  helpText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
})

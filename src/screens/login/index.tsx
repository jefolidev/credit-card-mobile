import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LockIcon } from 'src/assets/lock-icon'
import { SupplierIcon } from 'src/assets/supplier-icon'
import UserIcon from 'src/assets/user-icon'
import { Button } from 'src/components/button'
import { Input } from 'src/components/input'
import { RadioGroup } from 'src/components/radio'
import { useAuth } from 'src/contexts/use-auth'
import { UserRole } from 'src/services/auth/enum/user-role'
import { EyeIcon } from '../../assets/eye-simple'
import { applyCnpjMask, applyCpfMask, cleanCnpj, cleanCpf } from '../../utils'
import { LoginBodySchema } from './schema'

export function Login() {
  const [userType, setUserType] = useState<UserRole>('PORTATOR')
  const [showPassword, setShowPassword] = useState(false)

  const { auth, isLoading } = useAuth()

  const { handleSubmit, setValue, watch, reset, clearErrors } =
    useForm<LoginBodySchema>({
      defaultValues: {
        document: '',
        password: '',
      },
    })

  const document = watch('document')
  const password = watch('password')

  const handleDocumentChange = (text: string) => {
    let maskedDocument: string

    if (userType === 'PORTATOR') {
      maskedDocument = applyCpfMask(text)
    } else {
      // Para lojistas, detecta automaticamente se é CPF ou CNPJ pelo número de dígitos
      const digitsOnly = text.replace(/\D/g, '')
      maskedDocument =
        digitsOnly.length <= 11 ? applyCpfMask(text) : applyCnpjMask(text)
    }

    setValue('document', maskedDocument)
  }

  const handleUserTypeChange = (newUserType: UserRole) => {
    setUserType(newUserType)
    setValue('document', '') // Limpa o campo ao trocar o tipo
    clearErrors('document')
  }

  const userTypeOptions = [
    { id: UserRole.PORTATOR, label: 'Portador', icon: <UserIcon /> },
    { id: UserRole.SELLER, label: 'Lojista', icon: <SupplierIcon /> },
  ]

  const handleLogin = async (userData: LoginBodySchema) => {
    let cleanedDocument: string

    if (userType === 'PORTATOR') {
      cleanedDocument = cleanCpf(userData.document)
    } else {
      const digitsOnly = userData.document.replace(/\D/g, '')
      cleanedDocument =
        digitsOnly.length <= 11
          ? cleanCpf(userData.document)
          : cleanCnpj(userData.document)
    }

    try {
      const success = await auth(cleanedDocument, userData.password, userType)

      if (success) {
      } else {
        Alert.alert('Erro', 'Credenciais inválidos')
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante o login')
      console.error('Erro no login:', JSON.stringify(error, null, 2))
    }
  }

  const logo = require('../../../public/images/logo.png')

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={logo} style={{ width: 227, height: 50 }} />
        <View style={styles.loginContainer}>
          <RadioGroup
            options={userTypeOptions}
            selectedId={userType}
            onSelect={(id) => handleUserTypeChange(id as UserRole)}
          />

          <View style={styles.inputWrapper}>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>
                {userType === 'PORTATOR' ? 'CPF' : 'CNPJ/CPF'}
              </Text>
              <Input
                placeholder={
                  userType === 'PORTATOR'
                    ? 'Insira seu CPF'
                    : 'Insira o CNPJ/CPF'
                }
                leftIcon={
                  userType === 'PORTATOR' ? (
                    <UserIcon width={20} height={20} color="#99A1AF" />
                  ) : (
                    <SupplierIcon width={20} height={20} color="#99A1AF" />
                  )
                }
                value={document}
                onChangeText={handleDocumentChange}
                keyboardType="numeric"
                autoCapitalize="none"
                maxLength={userType === 'PORTATOR' ? 14 : 18} // CNPJ é maior (18), aceita ambos para lojistas
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>Senha</Text>
              <Input
                placeholder="Digite sua senha"
                value={password}
                onChangeText={(text) => setValue('password', text)}
                secureTextEntry={!showPassword}
                leftIcon={<LockIcon />}
                rightIcon={<EyeIcon closed={!showPassword} color="#99A1AF" />}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </View>
          </View>
          <View style={[styles.buttonWrapper, { marginTop: 5 }]}>
            <Button
              variant={userType === UserRole.SELLER ? 'secondary' : 'primary'}
              onPress={handleSubmit(handleLogin)}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingInline: 32,
    paddingVertical: 20,
  },
  loginContainer: {
    justifyContent: 'center',
    paddingBlockStart: 52,
    paddingBlockEnd: 64,
    paddingInline: 24,
    elevation: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 46,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginVertical: 8,
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Arimo_400Regular',
  },
  inputWrapper: {
    gap: 12,
  },
  buttonWrapper: {
    width: '100%',
    height: 40,
  },
})

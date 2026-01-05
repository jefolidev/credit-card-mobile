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
import { LetterIcon } from 'src/assets/email'
import { LockIcon } from 'src/assets/lock-icon'
import { SupplierIcon } from 'src/assets/supplier-icon'
import UserIcon from 'src/assets/user-icon'
import { Button } from 'src/components/button'
import { Input } from 'src/components/input'
import { RadioGroup } from 'src/components/radio'
import { useAuth } from 'src/contexts/use-auth'
import { UserRole } from 'src/services/auth/enum/user-role'
import { EyeIcon } from '../../assets/eye-simple'
import { applyCpfMask, cleanCpf } from '../../utils/cpf-mask'
import { LoginBodySchema } from './schema'

export function Login() {
  const [userType, setUserType] = useState<UserRole>('PORTATOR')
  const [showPassword, setShowPassword] = useState(false)

  const { auth, isLoading } = useAuth()

  const { handleSubmit, setValue, watch } = useForm<LoginBodySchema>({
    defaultValues: {
      cpf: '',
      password: '',
    },
  })

  const cpf = watch('cpf')
  const password = watch('password')

  const handleCpfChange = (text: string) => {
    const maskedCpf = applyCpfMask(text)
    setValue('cpf', maskedCpf)
  }

  const userTypeOptions = [
    { id: UserRole.PORTATOR, label: 'Portador', icon: <UserIcon /> },
    { id: UserRole.SELLER, label: 'Lojista', icon: <SupplierIcon /> },
  ]

  const handleLogin = async (userData: LoginBodySchema) => {
    const cleanedCpf = cleanCpf(cpf)

    try {
      const success = await auth(cleanedCpf, userData.password, userType)

      if (success) {
        // Login realizado com sucesso
      } else {
        Alert.alert('Erro', 'Credenciais inválidos')
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro durante o login')
      console.error('Erro no login:', error)
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
            onSelect={(id) => setUserType(id as UserRole)}
          />

          <View style={styles.inputWrapper}>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>CPF</Text>
              <Input
                placeholder="000.000.000-00"
                leftIcon={<LetterIcon />}
                value={cpf}
                onChangeText={handleCpfChange}
                keyboardType="numeric"
                autoCapitalize="none"
                maxLength={14}
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

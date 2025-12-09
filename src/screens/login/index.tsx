import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { LetterIcon } from 'src/assets/email'
import { LockIcon } from 'src/assets/lock-icon'
import { SupplierIcon } from 'src/assets/supplier-icon'
import UserIcon from 'src/assets/user-icon'
import { Button } from 'src/components/button'
import { Input } from 'src/components/input'
import { RadioGroup } from 'src/components/radio'
import { EyeIcon } from '../../assets/eye-simple'

export function Login() {
  const [userType, setUserType] = useState<'client' | 'supplier'>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const userTypeOptions = [
    { id: 'client', label: 'Cliente', icon: <UserIcon /> },
    { id: 'supplier', label: 'Fornecedor', icon: <SupplierIcon /> },
  ]

  const handleContinue = () => {
    console.log('Continue with:', { userType, email, password })
  }

  const logo = require('../../../public/images/logo.png')

  return (
    <View style={styles.container}>
      <Image source={logo} style={{ width: 227, height: 50 }} />
      <View style={styles.loginContainer}>
        <RadioGroup
          options={userTypeOptions}
          selectedId={userType}
          onSelect={(id) => setUserType(id as 'client' | 'supplier')}
        />

        <View style={styles.inputWrapper}>
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>E-mail</Text>
            <Input placeholder="seu@email.com" leftIcon={<LetterIcon />} />
          </View>
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Senha</Text>
            <Input
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon={<LockIcon />}
              rightIcon={<EyeIcon closed={!showPassword} color="#99A1AF" />}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          </View>
        </View>
        <View style={[styles.buttonWrapper, { marginTop: 5 }]}>
          <Button variant={userType === 'supplier' ? 'secondary' : 'primary'}>
            Entrar
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FAF9F6',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingInline: 32,
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

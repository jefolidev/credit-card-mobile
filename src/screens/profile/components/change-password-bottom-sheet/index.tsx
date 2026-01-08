import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Alert, Text, TextInput, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from '../../../../components/base-sheet'
import { Button } from '../../../../components/button'
import { useCard } from 'src/contexts/use-card'

export function ChangePasswordBottomSheet() {
  const navigation = useNavigation()
  const { changeCardPassword } = useCard()
  const [visible, setVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleChangePassword = async () => {
    // Validações
    if (!current || !next || !confirm) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios')
      return
    }

    if (next !== confirm) {
      Alert.alert('Erro', 'A nova senha e confirmação devem ser iguais')
      return
    }

    if (next.length < 4) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 4 caracteres')
      return
    }

    setIsLoading(true)
    try {
      const success = await changeCardPassword(current, next)

      if (success) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setVisible(false)
              navigation.goBack()
            },
          },
        ])
      } else {
        Alert.alert('Erro', 'Falha ao alterar senha. Verifique a senha atual.')
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao alterar a senha')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BaseSheet
      visible={visible}
      title="Alterar senha do cartão"
      onClose={() => {
        setVisible(false)
        navigation.goBack()
      }}
      footer={
        <View style={baseSheetStyles.actionsRow}>
          <Button
            variant="outline"
            style={baseSheetStyles.actionButton}
            onPress={() => {
              setVisible(false)
              navigation.goBack()
            }}
          >
            Cancelar
          </Button>
          <Button
            onPress={handleChangePassword}
            style={baseSheetStyles.actionButton}
            disabled={isLoading}
          >
            {isLoading ? 'Alterando...' : 'Alterar senha'}
          </Button>
        </View>
      }
    >
      <View style={baseSheetStyles.fieldGroup}>
        <Text style={baseSheetStyles.label}>Senha atual</Text>
        <TextInput
          placeholder="••••••"
          value={current}
          onChangeText={setCurrent}
          style={baseSheetStyles.input}
          secureTextEntry
        />
      </View>
      <View style={baseSheetStyles.fieldGroup}>
        <Text style={baseSheetStyles.label}>Nova senha</Text>
        <TextInput
          placeholder="••••••"
          value={next}
          onChangeText={setNext}
          style={baseSheetStyles.input}
          secureTextEntry
        />
      </View>
      <View style={baseSheetStyles.fieldGroup}>
        <Text style={baseSheetStyles.label}>Confirmar nova senha</Text>
        <TextInput
          placeholder="••••••"
          value={confirm}
          onChangeText={setConfirm}
          style={baseSheetStyles.input}
          secureTextEntry
        />
      </View>

      <View style={baseSheetStyles.tipBox}>
        <Text style={baseSheetStyles.tipTitle}>Dica de segurança</Text>
        <Text style={baseSheetStyles.tipText}>
          Use uma senha forte e não compartilhe com ninguém.
        </Text>
      </View>
    </BaseSheet>
  )
}

export default ChangePasswordBottomSheet

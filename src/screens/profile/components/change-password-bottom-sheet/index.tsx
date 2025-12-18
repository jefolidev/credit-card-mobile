import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from '../../../../components/base-sheet'
import { Button } from '../../../../components/button'

export function ChangePasswordBottomSheet() {
  const navigation = useNavigation()
  const [visible, setVisible] = useState(true)
  useFocusEffect(
    useCallback(() => {
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

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
            onPress={() => {
              setVisible(false)
              navigation.goBack()
            }}
            style={baseSheetStyles.actionButton}
          >
            Alterar senha
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

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from '../../../../components/base-sheet'
import { Button } from '../../../../components/button'
import { colors } from '../../../../theme/colors'

export function SecondCardBottomSheet() {
  const navigation = useNavigation()
  const [endereco, setEndereco] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [cep, setCep] = useState('')
  const [reason, setReason] = useState('')

  const [visible, setVisible] = useState(true)
  useFocusEffect(
    useCallback(() => {
      setEndereco('')
      setBairro('')
      setCidade('')
      setCep('')
      setReason('')
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )

  return (
    <BaseSheet
      visible={visible}
      title="Segunda Via de Cartão"
      onClose={() => {
        setVisible(false)
        navigation.goBack()
      }}
      footer={
        <View style={baseSheetStyles.actionsRow}>
          <Button
            style={baseSheetStyles.actionButton}
            variant="outline"
            onPress={() => {
              setVisible(false)
              navigation.goBack()
            }}
          >
            Cancelar
          </Button>
          <Button
            style={baseSheetStyles.actionButton}
            onPress={() => {
              setVisible(false)
              navigation.goBack()
            }}
          >
            Solicitar
          </Button>
        </View>
      }
    >
      <Text
        style={{
          color: colors.primaryText,
          marginBottom: 12,
        }}
      >
        Solicite um novo cartão físico
      </Text>
      <View style={[baseSheetStyles.fieldGroup, { marginBottom: 12 }]}>
        <Text style={baseSheetStyles.label}>Motivo da Solicitação</Text>
        <TextInput
          placeholder="Motivo"
          placeholderTextColor={colors.zinc[400]}
          {...(reason ? { value: reason } : { defaultValue: '' })}
          onChangeText={setReason}
          style={baseSheetStyles.input}
        />
      </View>
      <View style={{ marginBottom: 12 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={baseSheetStyles.label}>Endereço de Entrega</Text>
          <TextInput
            placeholder="Rua, número, complemento"
            placeholderTextColor={colors.zinc[400]}
            {...(endereco ? { value: endereco } : { defaultValue: '' })}
            onChangeText={setEndereco}
            style={baseSheetStyles.input}
          />
        </View>
        <View style={{ marginBottom: 5 }}>
          <TextInput
            placeholder="Bairro"
            placeholderTextColor={colors.zinc[400]}
            {...(bairro ? { value: bairro } : { defaultValue: '' })}
            onChangeText={setBairro}
            style={baseSheetStyles.input}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            placeholder="Cidade"
            placeholderTextColor={colors.zinc[400]}
            {...(cidade ? { value: cidade } : { defaultValue: '' })}
            onChangeText={setCidade}
            style={[baseSheetStyles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="CEP"
            placeholderTextColor={colors.zinc[400]}
            {...(cep ? { value: cep } : { defaultValue: '' })}
            onChangeText={setCep}
            style={[baseSheetStyles.input, { flex: 1 }]}
          />
        </View>
      </View>
    </BaseSheet>
  )
}

export default SecondCardBottomSheet

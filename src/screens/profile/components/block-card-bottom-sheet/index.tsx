import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from '../../../../components/base-sheet'
import { Button } from '../../../../components/button'
import { colors } from '../../../../theme/colors'

export function BlockCardBottomSheet() {
  const navigation = useNavigation()
  const [visible, setVisible] = useState(true)
  useFocusEffect(
    useCallback(() => {
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )

  return (
    <BaseSheet
      visible={visible}
      title="Bloquear cartão"
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
            variant="destructive"
            style={baseSheetStyles.actionButton}
            onPress={() => {
              setVisible(false)
              navigation.goBack()
            }}
          >
            Bloquear
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
        Ao bloquear, você não poderá usar o cartão até desbloqueá-lo novamente.
        Use em caso de perda ou roubo.
      </Text>
    </BaseSheet>
  )
}

export default BlockCardBottomSheet

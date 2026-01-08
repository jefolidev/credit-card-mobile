import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from '../../../../components/base-sheet'
import { Button } from '../../../../components/button'
import { useCard } from '../../../../contexts/use-card'
import { colors } from '../../../../theme/colors'

export default function BlockCardBottomSheet() {
  const navigation = useNavigation()
  const { blockCard, unblockCard, selectedCard } = useCard()
  const [visible, setVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )

  const isCardBlocked = !selectedCard?.isActive

  const handleCardAction = async () => {
    const action = isCardBlocked ? 'desbloquear' : 'bloquear'
    const actionTitle = isCardBlocked
      ? 'Confirmar Desbloqueio'
      : 'Confirmar bloqueio'
    const actionMessage = isCardBlocked
      ? 'Tem certeza que deseja desbloquear o cartão? Ele voltará a funcionar normalmente.'
      : 'Tem certeza que deseja bloquear o cartão? Esta ação impedirá o uso até que seja desbloqueado.'

    Alert.alert(actionTitle, actionMessage, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: isCardBlocked ? 'Desbloquear' : 'Bloquear',
        style: isCardBlocked ? 'default' : 'destructive',
        onPress: async () => {
          setIsLoading(true)
          try {
            const success = isCardBlocked
              ? await unblockCard()
              : await blockCard()

            if (success) {
              Alert.alert('Sucesso', `Cartão ${action}ado com sucesso!`, [
                {
                  text: 'OK',
                  onPress: () => {
                    setVisible(false)
                    navigation.goBack()
                  },
                },
              ])
            } else {
              Alert.alert(
                'Erro',
                `Falha ao ${action} o cartão. Tente novamente.`
              )
            }
          } catch (error) {
            Alert.alert('Erro', `Ocorreu um erro ao ${action} o cartão`)
          } finally {
            setIsLoading(false)
          }
        },
      },
    ])
  }

  return (
    <BaseSheet
      visible={visible}
      title={isCardBlocked ? 'Desbloquear cartão' : 'Bloquear cartão'}
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
            variant={isCardBlocked ? 'default' : 'destructive'}
            style={baseSheetStyles.actionButton}
            onPress={handleCardAction}
            disabled={isLoading}
          >
            {isLoading
              ? isCardBlocked
                ? 'Desbloqueando...'
                : 'Bloqueando...'
              : isCardBlocked
              ? 'Desbloquear'
              : 'Bloquear'}
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
        {isCardBlocked
          ? 'Ao desbloquear, você voltará a poder usar o cartão normalmente para compras e saques.'
          : 'Ao bloquear, você não poderá usar o cartão até desbloqueá-lo novamente. Use em caso de perda ou roubo.'}
      </Text>
    </BaseSheet>
  )
}

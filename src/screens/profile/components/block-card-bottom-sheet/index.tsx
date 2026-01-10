import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from '../../../../components/base-sheet'
import { Button } from '../../../../components/button'
import { useCard } from '../../../../contexts/use-card'
import { colors } from '../../../../theme/colors'

export default function BlockCardBottomSheet() {
  const navigation = useNavigation()
  const { blockCard, selectedCard } = useCard()
  const [visible, setVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )

  const handleCardAction = async () => {
    Alert.alert(
      'Confirmar Desbloqueio',
      'Tem certeza que deseja desbloquear o cartão? Ele voltará a funcionar normalmente.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Desbloquear',
          style: 'default',
          onPress: async () => {
            setIsLoading(true)
            try {
              const success = await blockCard()

              if (success) {
                Alert.alert('Sucesso', 'Cartão desbloqueado com sucesso!', [
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
                  'Falha ao desbloquear o cartão. Tente novamente.'
                )
              }
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao desbloquear o cartão')
            } finally {
              setIsLoading(false)
            }
          },
        },
      ]
    )
  }

  return (
    <BaseSheet
      visible={visible}
      title="Desbloquear cartão"
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
            variant="primary"
            style={baseSheetStyles.actionButton}
            onPress={handleCardAction}
            disabled={isLoading}
          >
            {isLoading ? 'Desbloqueando...' : 'Desbloquear'}
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
        Ao desbloquear, você voltará a poder usar o cartão normalmente para
        compras e saques.
      </Text>
    </BaseSheet>
  )
}

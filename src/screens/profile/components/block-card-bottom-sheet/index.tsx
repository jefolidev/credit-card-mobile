import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { BaseSheet, baseSheetStyles } from '../../../../components/base-sheet'
import { Button } from '../../../../components/button'
import { useCard } from '../../../../contexts/use-card'
import { colors } from '../../../../theme/colors'

export default function BlockCardBottomSheet() {
  const navigation = useNavigation()
  const {
    blockCard,
    checkCardBlockStatus,
    selectedCard,
    isCurrentCardBlocked,
  } = useCard()
  const [visible, setVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )

  useEffect(() => {
    checkCardBlockStatus()
  }, [isCurrentCardBlocked])

  const handleCardAction = async () => {
    const actionText = isCurrentCardBlocked ? 'desbloquear' : 'bloquear'
    const actionTextCapitalized = isCurrentCardBlocked
      ? 'Desbloquear'
      : 'Bloquear'
    const confirmMessage = isCurrentCardBlocked
      ? 'Tem certeza que deseja desbloquear o cartão? Ele voltará a funcionar normalmente.'
      : 'Tem certeza que deseja bloquear o cartão? Ele ficará temporariamente indisponível para uso.'

    Alert.alert(`Confirmar ${actionTextCapitalized}`, confirmMessage, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: actionTextCapitalized,
        style: isCurrentCardBlocked ? 'default' : 'destructive',
        onPress: async () => {
          setIsLoading(true)
          try {
            const success = await blockCard()

            if (success) {
              const successMessage = isCurrentCardBlocked
                ? 'Cartão desbloqueado com sucesso!'
                : 'Cartão bloqueado com sucesso!'

              Alert.alert('Sucesso', successMessage, [
                {
                  text: 'OK',
                  onPress: () => {
                    setVisible(false)
                    navigation.goBack()
                  },
                },
              ])
            } else {
              const errorMessage = isCurrentCardBlocked
                ? 'Falha ao desbloquear o cartão. Tente novamente.'
                : 'Falha ao bloquear o cartão. Tente novamente.'

              Alert.alert('Erro', errorMessage)
            }
          } catch (error) {
            const errorMessage = isCurrentCardBlocked
              ? 'Ocorreu um erro ao desbloquear o cartão'
              : 'Ocorreu um erro ao bloquear o cartão'

            Alert.alert('Erro', errorMessage)
          } finally {
            setIsLoading(false)
          }
        },
      },
    ])
  }

  const getTitle = () => {
    return isCurrentCardBlocked ? 'Desbloquear cartão' : 'Bloquear cartão'
  }

  const getDescription = () => {
    return isCurrentCardBlocked
      ? 'Ao desbloquear, você voltará a poder usar o cartão normalmente para compras e saques.'
      : 'Ao bloquear, o cartão ficará temporariamente indisponível. Você pode desbloqueá-lo a qualquer momento.'
  }

  const getButtonText = () => {
    if (isLoading) {
      return isCurrentCardBlocked ? 'Desbloqueando...' : 'Bloqueando...'
    }
    return isCurrentCardBlocked ? 'Desbloquear' : 'Bloquear'
  }

  const getButtonVariant = () => {
    return isCurrentCardBlocked ? 'primary' : 'destructive'
  }

  return (
    <BaseSheet
      visible={visible}
      title={getTitle()}
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
            variant={getButtonVariant()}
            style={baseSheetStyles.actionButton}
            onPress={handleCardAction}
            disabled={isLoading}
          >
            {getButtonText()}
          </Button>
        </View>
      }
    >
      <Text
        style={{
          color: colors.primaryText,
          marginBottom: 12,
          lineHeight: 20,
        }}
      >
        {getDescription()}
      </Text>

      {isLoading && (
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: colors.secondaryText, fontSize: 14 }}>
            Carregando...
          </Text>
        </View>
      )}
    </BaseSheet>
  )
}

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Button } from '../../components/button'
import { colors } from '../../theme/colors'

type BaseSheetProps = {
  visible: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

function BaseSheet({ visible, title, onClose, children }: BaseSheetProps) {
  const translateY = React.useRef(new Animated.Value(0)).current

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy)
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          onClose()
          translateY.setValue(0)
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  React.useEffect(() => {
    if (visible) {
      translateY.setValue(40)
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start()
    }
  }, [visible])

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.sheetHeader}>
            <View style={styles.dragHandle} />
            <Text style={styles.sheetTitle}>{title}</Text>
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}

export function AlterarSenhaBottomSheet() {
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
    >
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Senha atual</Text>
        <TextInput
          placeholder="••••••"
          secureTextEntry
          value={current}
          onChangeText={setCurrent}
          style={styles.input}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          placeholder="••••••"
          secureTextEntry
          value={next}
          onChangeText={setNext}
          style={styles.input}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput
          placeholder="••••••"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          style={styles.input}
        />
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>Dica de segurança</Text>
        <Text style={styles.tipText}>
          Use uma senha forte e não compartilhe com ninguém.
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <Button
          variant="outline"
          style={styles.actionButton}
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
          style={styles.actionButton}
        >
          Alterar senha
        </Button>
      </View>
    </BaseSheet>
  )
}

export function BloquearCartaoBottomSheet() {
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
    >
      <Text
        style={{
          color: colors.primaryText,
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        Ao bloquear, você não poderá usar o cartão até desbloqueá-lo novamente.
        Use em caso de perda ou roubo.
      </Text>
      <View style={styles.actionsRow}>
        <Button
          style={styles.actionButton}
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
          style={styles.actionButton}
          onPress={() => {
            setVisible(false)
            navigation.goBack()
          }}
        >
          Bloquear
        </Button>
      </View>
    </BaseSheet>
  )
}

export function SegundaViaBottomSheet() {
  const navigation = useNavigation()
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const [visible, setVisible] = useState(true)
  useFocusEffect(
    useCallback(() => {
      setVisible(true)
      return () => setVisible(false)
    }, [])
  )
  const [reason, setReason] = useState('')
  return (
    <BaseSheet
      visible={visible}
      title="Segunda Via de Cartão"
      onClose={() => {
        setVisible(false)
        navigation.goBack()
      }}
    >
      <Text
        style={{
          color: colors.primaryText,
          marginBottom: 12,
        }}
      >
        Solicite um novo cartão físico
      </Text>
      <View style={[styles.fieldGroup, { marginBottom: 12 }]}>
        <Text style={styles.label}>Motivo da Solicitação</Text>
        <TextInput
          placeholder="Motivo"
          secureTextEntry
          value={reason}
          onChangeText={setReason}
          style={styles.input}
        />
      </View>
      <View style={{ marginBottom: 12 }}>
        <View style={{ marginBottom: 5 }}>
          <Text style={styles.label}>Endereço de Entrega</Text>
          <TextInput
            placeholder="Rua, número, complemento"
            secureTextEntry
            value={next}
            onChangeText={setNext}
            style={styles.input}
          />
        </View>
        <View style={{ marginBottom: 5 }}>
          <TextInput
            placeholder="Bairro"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={styles.input}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            placeholder="Cidade"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="CEP"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={[styles.input, { flex: 1 }]}
          />
        </View>
      </View>
      <View style={styles.actionsRow}>
        <Button
          style={styles.actionButton}
          variant="outline"
          onPress={() => {
            setVisible(false)
            navigation.goBack()
          }}
        >
          Cancelar
        </Button>
        <Button
          style={styles.actionButton}
          onPress={() => {
            setVisible(false)
            navigation.goBack()
          }}
        >
          Solicitar
        </Button>
      </View>
    </BaseSheet>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  sheetHeader: { alignItems: 'flex-start', marginBottom: 8 },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.gray[300],
    marginBottom: 8,
    alignSelf: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: colors.primaryText,
  },

  fieldGroup: { marginBottom: 12 },
  label: { fontSize: 12, color: colors.zinc[500], marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },

  tipBox: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  tipText: { fontSize: 12, color: colors.zinc[500] },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 50,
  },
})

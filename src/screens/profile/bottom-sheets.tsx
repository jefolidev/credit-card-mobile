import React, { useState } from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

function BaseSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{title}</Text>
          {children}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export function AlterarSenhaBottomSheet() {
  const [visible, setVisible] = useState(true)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  return (
    <BaseSheet
      visible={visible}
      title="Alterar senha"
      onClose={() => setVisible(false)}
    >
      <TextInput
        placeholder="Senha atual"
        secureTextEntry
        value={current}
        onChangeText={setCurrent}
        style={styles.input}
      />
      <TextInput
        placeholder="Nova senha"
        secureTextEntry
        value={next}
        onChangeText={setNext}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />
      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Alterar</Text>
      </TouchableOpacity>
    </BaseSheet>
  )
}

export function BloquearCartaoBottomSheet() {
  const [visible, setVisible] = useState(true)
  return (
    <BaseSheet
      visible={visible}
      title="Bloquear cartão"
      onClose={() => setVisible(false)}
    >
      <Text style={styles.message}>
        Tem certeza que deseja bloquear seu cartão?
      </Text>
      <TouchableOpacity style={styles.dangerBtn}>
        <Text style={styles.dangerText}>Bloquear</Text>
      </TouchableOpacity>
    </BaseSheet>
  )
}

export function SegundaViaBottomSheet() {
  const [visible, setVisible] = useState(true)
  const [motivo, setMotivo] = useState('')
  return (
    <BaseSheet
      visible={visible}
      title="Solicitar segunda via"
      onClose={() => setVisible(false)}
    >
      <TextInput
        placeholder="Motivo"
        value={motivo}
        onChangeText={setMotivo}
        style={styles.input}
      />
      <TouchableOpacity style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Solicitar</Text>
      </TouchableOpacity>
    </BaseSheet>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  message: { marginBottom: 12 },
  primaryBtn: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryText: { color: 'white', fontWeight: '600' },
  dangerBtn: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerText: { color: 'white', fontWeight: '600' },
  closeBtn: { marginTop: 8, alignItems: 'center', padding: 8 },
  closeText: { color: '#374151' },
})

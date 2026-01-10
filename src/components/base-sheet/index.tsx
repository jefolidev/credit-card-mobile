import React from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { colors } from '../../theme/colors'

type BaseSheetProps = {
  visible: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export function BaseSheet({
  visible,
  title,
  onClose,
  children,
  footer,
}: BaseSheetProps) {
  const translateY = React.useRef(new Animated.Value(0)).current

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only handle pan gestures on the header area, not the content
        return evt.nativeEvent.pageY < 150
      },
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.sheet, { transform: [{ translateY }] }]}
          >
            <View style={styles.sheetHeader} {...panResponder.panHandlers}>
              <View style={styles.dragHandle} />
              <Text style={styles.sheetTitle}>{title}</Text>
            </View>

            <ScrollView
              style={styles.scrollContent}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {children}
            </ScrollView>

            {footer && <View style={styles.footerContainer}>{footer}</View>}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
    height: '80%',
    minHeight: 200,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 8,
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

  footerContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
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

export { styles as baseSheetStyles }

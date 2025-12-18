import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ArrowLeftIcon } from 'src/assets/arrow-left'
import { KeyboardIcon } from 'src/assets/keyboard-icon'
import { QrCodeLargeIcon } from 'src/assets/qr-code-large-icon'
import { colors } from 'src/theme/colors'

interface NewSaleProps {
  onSelectManualSale: () => void
  onSelectQrCodeSale: () => void
  onGoBack: () => void
}

export function NewSale({
  onSelectManualSale,
  onSelectQrCodeSale,
  onGoBack,
}: NewSaleProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <ArrowLeftIcon width={20} height={20} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova venda</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Escolha o método de venda</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* Manual Sale Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={onSelectManualSale}
          >
            <View style={[styles.iconContainer, styles.greenBackground]}>
              <KeyboardIcon
                width={32}
                height={32}
                color={colors.emerald[600]}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Venda Manual</Text>
              <Text style={styles.optionDescription}>
                Digite as informações do cartão do cliente
              </Text>
            </View>
          </TouchableOpacity>

          {/* QR Code Sale Option */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={onSelectQrCodeSale}
          >
            <View style={[styles.iconContainer, styles.purpleBackground]}>
              <QrCodeLargeIcon width={32} height={32} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Venda com QR Code</Text>
              <Text style={styles.optionDescription}>
                Gere um QR Code para o cliente escanear
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 41,
    gap: 8,
  },
  backButton: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    letterSpacing: -0.32,
  },
  content: {
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 363,
    alignSelf: 'center',
    paddingTop: 12,
  },
  titleSection: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '#101828',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.45,
    borderColor: colors.gray[200],
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 118.9,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenBackground: {
    backgroundColor: '#dcfce7',
  },
  purpleBackground: {
    backgroundColor: colors.foreground,
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#101828',
    lineHeight: 24,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray[500],
    lineHeight: 20,
    flexWrap: 'wrap',
  },
})

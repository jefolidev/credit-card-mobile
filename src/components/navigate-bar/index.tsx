import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'src/theme/colors'

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
  onPress?: () => void
}

interface NavigateBarProps {
  currentTab: 'home' | 'transactions' | 'cards' | 'profile'
  items: NavigationItem[]
  activeItemId?: string
  qrCodeIcon?: React.ReactNode
  onQrCodePress?: () => void
  onItemPress?: (itemId: string) => void
  onTabPress: (tab: 'home' | 'transactions' | 'cards' | 'profile') => void
}

export function NavigateBar({
  items,
  activeItemId,
  onItemPress,
  qrCodeIcon,
  onQrCodePress,
}: NavigateBarProps) {
  const insets = useSafeAreaInsets()

  const handleItemPress = (item: NavigationItem) => {
    if (item.onPress) {
      item.onPress()
    } else if (onItemPress) {
      onItemPress(item.id)
    }
  }

  const renderIcon = (icon: React.ReactNode, isActive: boolean) => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        color: isActive ? colors.primary : colors.gray[400],
        width: 24,
        height: 24,
      } as any)
    }
    return icon
  }

  // Divide os itens em duas partes para posicionar o botão QR no meio
  const leftItems = items.slice(0, 2)
  const rightItems = items.slice(2)

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(12, insets.bottom) }]}
    >
      {/* Primeira metade dos itens */}
      {leftItems.map((item) => {
        const isActive = activeItemId
          ? activeItemId === item.id
          : item.isActive ?? false

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navigationItem}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {renderIcon(item.icon, isActive)}
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        )
      })}

      {/* Botão QR Code em destaque */}
      <TouchableOpacity
        style={styles.qrButtonContainer}
        onPress={onQrCodePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#773CBD', '#550DD1', '#4E03D5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.qrButton}
        >
          {qrCodeIcon}
        </LinearGradient>
      </TouchableOpacity>

      {/* Segunda metade dos itens */}
      {rightItems.map((item) => {
        const isActive = activeItemId
          ? activeItemId === item.id
          : item.isActive ?? false

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navigationItem}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {renderIcon(item.icon, isActive)}
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'flex-end',
  },
  navigationItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.gray[600],
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 32,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  qrButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
})

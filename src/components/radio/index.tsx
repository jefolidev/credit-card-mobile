import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../theme/colors'

interface RadioOption {
  id: string
  label: string
  icon?: React.ReactNode
}

interface RadioGroupProps {
  options: RadioOption[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function RadioGroup({ options, selectedId, onSelect }: RadioGroupProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = selectedId === option.id
        const gradientColors = isSelected
          ? index === 1
            ? (['#FF8D28', '#F93332', '#d71275'] as const)
            : (['#773CBD', '#550DD1', '#4E03D5'] as const)
          : (['#f3f4f6', '#f3f4f6', '#f3f4f6'] as const)

        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.radioCard]}
            onPress={() => onSelect(option.id)}
            activeOpacity={0.95}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />

            <View style={styles.cardContent}>
              {option.icon && (
                <View
                  style={[
                    styles.iconContainer,
                    option.id === 'supplier' && { marginTop: 2 },
                  ]}
                >
                  {React.isValidElement(option.icon)
                    ? React.cloneElement(option.icon, {
                        color: isSelected ? '#FFFFFF' : colors.gray[400],
                        width: 18,
                        height: 24,
                      } as any)
                    : option.icon}
                </View>
              )}

              <Text
                style={[
                  styles.cardLabel,
                  isSelected && styles.cardLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  radioCard: {
    flex: 1,
    minHeight: 30,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    maxWidth: '50%',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gray[400],
    textAlign: 'center',
  },
  cardLabelSelected: {
    color: '#FFFFFF',
  },
})

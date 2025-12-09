import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../../theme/colors'

interface RadioOption {
  id: string
  label: string
  icon?: React.ReactNode
  gradient: 'primary' | 'secondary'
}

interface RadioGroupProps {
  options: RadioOption[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function RadioGroup({ options, selectedId, onSelect }: RadioGroupProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedId === option.id
        const gradientColors =
          option.gradient === 'primary'
            ? (['#773CBD', '#550DD1', '#4E03D5'] as const)
            : (['#FF8D28', '#F93332', '#CD086A'] as const)

        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.radioCard,
              isSelected && styles.radioCardSelected,
            ]}
            onPress={() => onSelect(option.id)}
            activeOpacity={0.8}
          >
            {isSelected && (
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
              />
            )}

            <View style={styles.cardContent}>
              {option.icon && (
                <View style={styles.iconContainer}>
                  {React.isValidElement(option.icon)
                    ? React.cloneElement(option.icon, {
                        color: isSelected
                          ? '#FFFFFF'
                          : colors.gray[400],
                        width: 32,
                        height: 32,
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

// Componente pré-configurado para login (Cliente/Fornecedor)
interface LoginRadioProps {
  selectedType: 'client' | 'supplier' | null
  onSelect: (type: 'client' | 'supplier') => void
  clientIcon?: React.ReactNode
  supplierIcon?: React.ReactNode
}

export function LoginRadio({
  selectedType,
  onSelect,
  clientIcon,
  supplierIcon,
}: LoginRadioProps) {
  const options: RadioOption[] = [
    {
      id: 'client',
      label: 'Cliente',
      icon: clientIcon,
      gradient: 'primary',
    },
    {
      id: 'supplier',
      label: 'Fornecedor',
      icon: supplierIcon,
      gradient: 'secondary',
    },
  ]

  return (
    <RadioGroup
      options={options}
      selectedId={selectedType}
      onSelect={(id) => onSelect(id as 'client' | 'supplier')}
    />
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
    minHeight: 120,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.gray[200],
    position: 'relative',
    overflow: 'hidden',
  },
  radioCardSelected: {
    borderColor: 'transparent',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gray[600],
    textAlign: 'center',
  },
  cardLabelSelected: {
    color: '#FFFFFF',
  },
})

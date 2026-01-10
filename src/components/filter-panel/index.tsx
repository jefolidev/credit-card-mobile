import React from 'react'
import { Control, Controller } from 'react-hook-form'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors } from 'src/theme/colors'
import { formatCurrency } from 'src/utils'
import { DateInput } from '../date-input'

interface FilterPanelProps {
  control: Control<any>
  visible: boolean
  onClear: () => void
  showAllFields?: boolean // Para controlar quais campos mostrar
}

export function FilterPanel({
  control,
  visible,
  onClear,
  showAllFields = true,
}: FilterPanelProps) {
  if (!visible) return null

  return (
    <View style={styles.advancedFiltersPanel}>
      <View style={styles.advancedFiltersHeader}>
        <Text style={styles.advancedFiltersTitle}>Filtros avançados</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearFiltersText}>Limpar filtros</Text>
        </TouchableOpacity>
      </View>

      {showAllFields && (
        <View style={styles.filtersRow}>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <DateInput
                label="Data inicial"
                value={value}
                onChange={onChange}
                placeholder="DD/MM/AAAA"
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, value } }) => (
              <DateInput
                label="Data final"
                value={value}
                onChange={onChange}
                placeholder="DD/MM/AAAA"
              />
            )}
          />
        </View>
      )}

      {showAllFields && (
        <View style={styles.filtersRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Valor mínimo</Text>
            <Controller
              control={control}
              name="minAmount"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.filterInput}
                  placeholder="R$ 0,00"
                  value={value}
                  onChangeText={(text: string) => {
                    const formatted = formatCurrency(text)
                    onChange(formatted)
                  }}
                  keyboardType="numeric"
                />
              )}
            />
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Valor máximo</Text>
            <Controller
              control={control}
              name="maxAmount"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.filterInput}
                  placeholder="R$ 999,99"
                  value={value}
                  onChangeText={(text: string) => {
                    const formatted = formatCurrency(text)
                    onChange(formatted)
                  }}
                  keyboardType="numeric"
                />
              )}
            />
          </View>
        </View>
      )}

      <View style={styles.filtersRow}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Número do cartão</Text>
          <Controller
            control={control}
            name="cardNumber"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.filterInput}
                placeholder="6050 **** **** 1234"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={19}
              />
            )}
          />
        </View>
      </View>

      {showAllFields && (
        <View style={styles.filtersRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Ordenação por valor</Text>
            <Controller
              control={control}
              name="asc"
              render={({ field: { onChange, value } }) => (
                <View style={styles.sortButtons}>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      value && styles.sortButtonActive,
                    ]}
                    onPress={() => onChange(true)}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        value && styles.sortButtonTextActive,
                      ]}
                    >
                      Crescente
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      !value && styles.sortButtonActive,
                    ]}
                    onPress={() => onChange(false)}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        !value && styles.sortButtonTextActive,
                      ]}
                    >
                      Decrescente
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  advancedFiltersPanel: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  advancedFiltersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  advancedFiltersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    fontFamily: 'Arimo_600SemiBold',
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Arimo_400Regular',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Arimo_400Regular',
    marginBottom: 8,
    fontWeight: '500',
  },
  filterInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5dc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Arimo_400Regular',
  },
  sortButtonTextActive: {
    color: 'white',
  },
})

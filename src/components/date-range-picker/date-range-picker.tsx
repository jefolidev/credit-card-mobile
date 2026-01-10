import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  startLabel?: string
  endLabel?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = 'Data inicial',
  endLabel = 'Data final',
}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Selecionar data'
    return date.toLocaleDateString('pt-BR')
  }

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios')
    if (selectedDate) {
      onStartDateChange(selectedDate)
    }
  }

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios')
    if (selectedDate) {
      onEndDateChange(selectedDate)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputItem}>
          <Text style={styles.label}>{startLabel}</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowStartPicker(true)}
          >
            <Text
              style={[styles.dateText, !startDate && styles.placeholderText]}
            >
              {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputItem}>
          <Text style={styles.label}>{endLabel}</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={[styles.dateText, !endDate && styles.placeholderText]}>
              {formatDate(endDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Arimo_400Regular',
    marginBottom: 8,
    fontWeight: '500',
  },
  dateInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5dc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
  },
  placeholderText: {
    color: '#9ca3af',
  },
})

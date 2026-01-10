import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import React, { useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CalendarIcon } from '../../assets/calendar-icon'

dayjs.extend(customParseFormat)

interface DateInputProps {
  label: string
  value?: string
  onChange: (date: string) => void
  placeholder?: string
}

export function DateInput({
  label,
  value,
  onChange,
  placeholder,
}: DateInputProps) {
  const [show, setShow] = useState(false)

  const parseDate = (dateStr: string): Date => {
    if (!dateStr || !dateStr.trim()) return new Date()
    const parsed = dayjs(dateStr, 'DD/MM/YYYY', true)
    return parsed.isValid() ? parsed.toDate() : new Date()
  }

  const formatDate = (date: Date): string => {
    return dayjs(date).format('DD/MM/YYYY')
  }

  const currentDate = value ? parseDate(value) : new Date()

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const isCancel = event.type === 'dismissed'
    setShow(Platform.OS === 'ios' && !isCancel)

    if (!isCancel && selectedDate) {
      const formattedDate = formatDate(selectedDate)
      onChange(formattedDate)
    }
  }

  const openDatePicker = () => {
    setShow(true)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {value || placeholder || 'Selecionar data'}
        </Text>
        <CalendarIcon width={20} height={20} color="#666" />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
})

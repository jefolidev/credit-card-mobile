import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import colors from 'src/theme/colors'

interface BillInfoCardProps {
  title: string
  info: string
}

export function BillInfoCard({ title, info }: BillInfoCardProps) {
  return (
    <View style={styles.box}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.info}>{info}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingBlock: 35,
    paddingInlineEnd: 50,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: 8,
  },
  title: {
    fontFamily: 'Inter_400Regular',
    flexWrap: 'wrap',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  info: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.primaryText,
  },
})

export default BillInfoCard

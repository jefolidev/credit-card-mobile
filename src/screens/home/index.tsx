import { ScrollView, Text, View } from 'react-native'
import { BillInfoCard } from 'src/components/bill-info-card'
import colors from '../../theme/colors'

export function Home() {
  const { primaryText } = colors

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 12, gap: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Inter_600SemiBold',
            color: colors.primaryText,
            marginBottom: 10,
          }}
        >
          Informações da Fatura
        </Text>

        <BillInfoCard title="Próximo Fechamento" info="Dia 15" />
      </View>
    </ScrollView>
  )
}

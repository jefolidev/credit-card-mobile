import { ScrollView, Text, View } from 'react-native'
import { TransactionItem } from 'src/components/transaction-item'
import colors from '../../theme/colors'

export function Home() {
  const { primaryText } = colors

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 12, gap: 15 }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Inter_600SemiBold',
            color: colors.primaryText,
            marginBottom: 10,
          }}
        >
          Transações Recentes
        </Text>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <TransactionItem
            title="Mercado São João"
            description="Compras do mês"
            amount={-156.78}
            date={new Date(2024, 11, 8)} // December 8, 2024
            type="debit"
            category="Alimentação"
            onPress={() => console.log('Mercado clicado')}
          />

          <TransactionItem
            title="Pagamento PIX"
            description="João Silva"
            amount={-89.9}
            date={new Date(2024, 11, 8)} // December 8, 2024
            type="transfer"
            category="Transferência"
            onPress={() => console.log('PIX clicado')}
          />

          <TransactionItem
            title="Cashback"
            description="Recompensa do cartão"
            amount={12.45}
            date={new Date(2024, 11, 7)} // December 7, 2024
            type="credit"
            category="Cashback"
            onPress={() => console.log('Cashback clicado')}
          />

          <TransactionItem
            title="Farmácia Popular"
            description="Medicamentos"
            amount={-67.32}
            date={new Date(2024, 11, 7)} // December 7, 2024
            type="debit"
            category="Saúde"
            onPress={() => console.log('Farmácia clicado')}
          />

          <TransactionItem
            title="Uber"
            description="Corrida Centro-Casa"
            amount={-18.5}
            date={new Date(2024, 11, 6)} // December 6, 2024
            type="debit"
            category="Transporte"
            onPress={() => console.log('Uber clicado')}
          />
        </View>
      </View>
    </ScrollView>
  )
}

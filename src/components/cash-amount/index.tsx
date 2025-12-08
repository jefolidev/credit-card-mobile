import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, View } from 'react-native'
import { useAmountVisibility } from 'src/contexts/use-amount-visibility'
import colors from 'src/theme/colors'
import { ButtonIcon } from '../button-icon'
import { Dot } from '../dot'

const FICTITIOUS_VALUE = 200000

export function CashAmount() {
  const { handleSetAmountVisibility, eyeState, isVisible } =
    useAmountVisibility()

  return (
    <LinearGradient
      colors={['#773CBD', '#550DD1', '#4E03D5']}
      start={{ x: 0.1, y: 0.6 }}
      end={{ x: 1, y: 1 }}
      style={cardStyles.container}
    >
      <View
        style={{
          marginBottom: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={cardStyles.header}>Crédito Disponível</Text>
        <ButtonIcon
          icon={eyeState}
          onPress={() => handleSetAmountVisibility()}
          isClickable
        />
      </View>

      <View>
        <View
          style={
            isVisible
              ? cardStyles.cashierVisibleContainer
              : cardStyles.cashierInvisibleAmount
          }
        >
          {isVisible ? (
            <Text style={cardStyles.cashierVisibleAmount}>
              {FICTITIOUS_VALUE}
            </Text>
          ) : (
            Array(5)
              .fill(0)
              .map((_, index) => <Dot key={index} style={cardStyles.dots} />)
          )}
        </View>
        <Text style={cardStyles.header}>Cartão 6050 **** **** 1543</Text>
      </View>
    </LinearGradient>
  )
}

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryGradient,
    borderRadius: 12,
    padding: 28,
  },
  header: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 14,
    color: colors.zinc[100],
    textTransform: 'uppercase',
  },
  cashierVisibleContainer: {
    minHeight: 34, // Altura mínima para manter consistência
  },
  cashierVisibleAmount: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 28,
    color: colors.background,
  },
  cashierInvisibleAmount: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-start', // Alinha à esquerda como o texto
    alignItems: 'center',
    minHeight: 34, // Mesma altura do container visível
  },
  dots: {
    padding: 6,
  },
})

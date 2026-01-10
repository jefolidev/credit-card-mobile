import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, View } from 'react-native'
import colors from 'src/theme/colors'
import { formatCardNumber } from 'src/utils'
import { Dot } from '../dot'

interface CreditCardProps {
  cardNumber: string
  cardOwner: string
  cardType?: string
  cardAssociation?: string
  cpf?: string
  shouldRenderNumber?: boolean
}

export function CreditCard({
  cardNumber,
  cardOwner,
  cpf,
  shouldRenderNumber = false,
}: CreditCardProps) {
  const maskCardNumber = (number: string) => {
    const clean = number.replace(/\s+/g, '')

    const first = clean.slice(0, 4)
    const mid1 = clean.slice(4, 8)
    const mid2 = clean.slice(8, 12)
    const last = clean.slice(12)

    return [
      <Text style={cardStyles.cardNumberText} key="first">
        {first}
      </Text>,

      <View style={cardStyles.dotGroup} key="mid1">
        {[...mid1].map((_, i) => (
          <Dot key={`m1-${i}`} />
        ))}
      </View>,

      <View style={cardStyles.dotGroup} key="mid2">
        {[...mid2].map((_, i) => (
          <Dot key={`m2-${i}`} />
        ))}
      </View>,

      <Text style={cardStyles.cardNumberText} key="last">
        {last}
      </Text>,
    ]
  }

  return (
    <LinearGradient
      colors={['#773CBD', '#550DD1', '#4E03D5']}
      start={{ x: 0.1, y: 0.6 }}
      end={{ x: 1, y: 1 }}
      style={cardStyles.container}
    >
      <View style={cardStyles.chipContainer}>
        <LinearGradient
          colors={['#FFDF20', '#F0B100']}
          start={{ x: 0.05, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardStyles.chip}
        />
      </View>

      <View style={cardStyles.infoGroup}>
        <Text style={cardStyles.legend}>Número do Cartão</Text>
        <Text>
          {shouldRenderNumber ? (
            <Text style={cardStyles.cardNumberText}>
              {formatCardNumber(cardNumber)}
            </Text>
          ) : (
            maskCardNumber(cardNumber)
          )}
        </Text>
      </View>

      <View style={[cardStyles.infoGroup, cardStyles.row]}>
        <View>
          <Text style={cardStyles.legend}>Titular do cartão</Text>
          <Text style={cardStyles.text}>{cardOwner}</Text>
        </View>

        {cpf && (
          <View>
            <Text style={cardStyles.legend}>CPF</Text>
            <Text style={cardStyles.text}>{cpf}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  )
}

const cardStyles = StyleSheet.create({
  container: {
    paddingBlock: 30,
    paddingInline: 25,
    backgroundColor: colors.primaryGradient,
    borderRadius: 12,
    width: '100%',
  },
  chipContainer: {
    marginBottom: 8,
  },
  chip: {
    width: 50,
    height: 36,
    padding: 20,
    borderRadius: 6,
  },
  infoGroup: {
    marginBlock: 6,
  },
  legend: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 14,
    color: colors.zinc[300],
    textTransform: 'uppercase',
  },
  cardNumberText: {
    fontFamily: 'Arimo_400Regular',
    fontSize: 24,
    color: colors.background,
  },
  dotGroup: {
    flexDirection: 'row',
    padding: 7,
    gap: 4,
  },
  text: {
    fontFamily: 'Arimo_400Regular',
    textTransform: 'uppercase',
    fontSize: 18,
    color: colors.background,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default CreditCard

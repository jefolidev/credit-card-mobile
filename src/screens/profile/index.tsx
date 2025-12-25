import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ChevronRightIcon from 'src/assets/chevron-right-icon'
import CycleArrowPencil from 'src/assets/cycle-arrows-icon'
import EarPhonesIcon from 'src/assets/ear-phones-icon'
import IdentificationIcon from 'src/assets/identification-icon'
import KeyIcon from 'src/assets/key-icon'
import LocalPinIcon from 'src/assets/local-pin-icon'
import { LockIcon } from 'src/assets/lock-icon'
import { PhoneIcon } from 'src/assets/phone-icon'
import EditPencil from '../../assets/edit-pencil'
import { UserIcon } from '../../assets/user-icon'
import { Header } from '../../components/header'
import { useAuth } from '../../contexts/use-auth'
import { useCard } from '../../contexts/use-card'
import { colors } from '../../theme/colors'
import { applyCpfMask } from '../../utils/cpf-mask'

export function Profile() {
  const { user, logout } = useAuth()
  const { selectedCard, logoutCard } = useCard()
  const { getUserCards } = useCard()

  const userCards = getUserCards(user!.id)

  const navigation = useNavigation()

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logoutCard()
          logout()
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Header icon={<UserIcon />} title="Perfil" />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {/* Nome do portador */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 4,
              marginBottom: 18,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <LinearGradient
                colors={['#773CBD', '#550DD1', '#4E03D5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 58,
                  height: 58,
                  padding: 8,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>
                  {user?.name?.at(0)?.toUpperCase()}
                </Text>
              </LinearGradient>
              <Text
                style={{
                  color: colors.primaryText,
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                {user?.name?.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={{ marginRight: 12 }}>
              <EditPencil width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* Informacoes adicionais */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              gap: 12,
              marginTop: 5,
              marginBottom: 32,
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.primary, fontSize: 20 }}>
                {userCards.length}
              </Text>
              <Text style={{ color: colors.primary, fontSize: 14 }}>
                Cartões ativos
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.primary, fontSize: 20 }}>
                {userCards.reduce((total, card) => {
                  const currentDate = new Date()
                  const month = currentDate.getMonth()
                  const year = currentDate.getFullYear()
                  const countForCard = (card.bills || []).reduce(
                    (sum, bill) => {
                      const txCount = (bill.transactions || []).filter((t) => {
                        const transactionDate = new Date(t.date)
                        return (
                          transactionDate.getMonth() === month &&
                          transactionDate.getFullYear() === year
                        )
                      }).length
                      return sum + txCount
                    },
                    0
                  )
                  return total + countForCard
                }, 0)}
              </Text>
              <Text style={{ color: colors.primary, fontSize: 14 }}>
                Transações/Mês
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 20,
                  flexWrap: 'wrap',
                }}
              >
                {selectedCard?.creditLimit.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </Text>
              <Text style={{ color: colors.primary, fontSize: 14 }}>
                Limite Total
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações de Contato</Text>

            <View style={styles.infoCardRow}>
              <View style={styles.infoIconCircle}>
                <IdentificationIcon width={24} height={24} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.label}>CPF</Text>
                <Text style={styles.value}>{applyCpfMask(user?.cpf)}</Text>
              </View>
            </View>
            <View style={styles.infoCardRow}>
              <View style={styles.infoIconCircle}>
                <PhoneIcon width={21} height={21} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.label}>Telefone</Text>
                <Text style={styles.value}>
                  {user?.phone ?? '(--) ----- ----'}
                </Text>
              </View>
              <TouchableOpacity style={{ marginRight: 12 }}>
                <EditPencil width={22} height={22} color={colors.zinc[500]} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoCardRow}>
              <View style={styles.infoIconCircle}>
                <LocalPinIcon width={26} height={26} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.label}>Localização</Text>
                <Text style={styles.value}>
                  {user?.city ? `${user.city}, ${user.state}` : 'São Paulo, SP'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {selectedCard && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate('ChangePasswordBottomSheet' as never)
              }
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIcon}>
                  <KeyIcon color={colors.primary} width={28} height={28} />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Alterar Senha</Text>
                  <Text style={styles.actionSubtitle}>
                    Mude sua senha para maior segurança
                  </Text>
                </View>
              </View>
              <View style={styles.chevron}>
                <ChevronRightIcon />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate('BlockCardBottomSheet' as never)
              }
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIcon}>
                  <LockIcon color={colors.primary} width={28} height={28} />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Bloquear Cartão</Text>
                  <Text style={styles.actionSubtitle}>
                    Bloqueie ou desbloqueie seu cartão
                  </Text>
                </View>
              </View>
              <View style={styles.chevron}>
                <ChevronRightIcon />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate('SecondCardBottomSheet' as never)
              }
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIcon}>
                  <CycleArrowPencil
                    color={colors.primary}
                    width={28}
                    height={28}
                  />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Segunda Via de Cartão</Text>
                  <Text style={styles.actionSubtitle}>
                    Solicite uma segunda via de cartão
                  </Text>
                </View>
              </View>
              <View style={styles.chevron}>
                <ChevronRightIcon />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Contacts' as never)}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIcon}>
                  <EarPhonesIcon
                    color={colors.primary}
                    width={28}
                    height={28}
                  />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Serviço de Atendimento</Text>
                  <Text style={styles.actionSubtitle}>
                    Veja nossos meios de contatos e fale conosco
                  </Text>
                </View>
              </View>
              <View style={styles.chevron}>
                <ChevronRightIcon />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingInline: 24,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 12,
  },
  infoCardRow: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[100],
  },
  infoTexts: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.zinc[500],
  },
  value: {
    fontSize: 16,
    color: colors.primaryText,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 200,
    backgroundColor: colors.foreground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 14,
    color: colors.primaryText,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.zinc[500],
  },
  chevron: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

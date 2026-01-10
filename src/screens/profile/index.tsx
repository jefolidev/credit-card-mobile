import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ChevronRightIcon from 'src/assets/chevron-right-icon'
import IdentificationIcon from 'src/assets/identification-icon'
import KeyIcon from 'src/assets/key-icon'
import { LockIcon } from 'src/assets/lock-icon'
import { UnlockIcon } from 'src/assets/unlock-icon'
import EditPencil from '../../assets/edit-pencil'
import { UserIcon } from '../../assets/user-icon'
import { Header } from '../../components/header'
import { useAuth } from '../../contexts/use-auth'
import { useCard } from '../../contexts/use-card'
import { colors } from '../../theme/colors'

export function Profile() {
  const { user, logout } = useAuth()
  const { selectedCard, logoutCard, cards, getUserCards, getBillingDetails } =
    useCard()
  const [currentMonthTransactionsCount, setCurrentMonthTransactionsCount] =
    useState(0)

  const navigation = useNavigation()

  // Mapear os meses string para números
  const monthMap: { [key: string]: number } = {
    JAN: 0,
    FEV: 1,
    MAR: 2,
    ABR: 3,
    MAI: 4,
    JUN: 5,
    JUL: 6,
    AGO: 7,
    SET: 8,
    OUT: 9,
    NOV: 10,
    DEZ: 11,
  }

  // Função para formatar data para comparação (YYYY-MM)
  const formatMonthYear = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`
  }

  // Função para contar transações do mês atual
  const loadCurrentMonthTransactionsCount = async () => {
    if (!selectedCard || !selectedCard.bills) {
      setCurrentMonthTransactionsCount(0)
      return
    }

    try {
      const currentMonth = formatMonthYear(new Date())

      // Buscar fatura do mês atual
      const currentBill = selectedCard.bills.find((bill) => {
        const monthNumber = monthMap[bill.month]
        if (monthNumber === undefined) return false

        const billMonth = formatMonthYear(new Date(bill.year, monthNumber))
        return billMonth === currentMonth
      })

      if (currentBill) {
        const billDetails = await getBillingDetails(currentBill.id)
        if (billDetails && billDetails.sellInstallments) {
          setCurrentMonthTransactionsCount(billDetails.sellInstallments.length)
        } else {
          setCurrentMonthTransactionsCount(0)
        }
      } else {
        setCurrentMonthTransactionsCount(0)
      }
    } catch (error) {
      console.error('Erro ao buscar contagem de transações:', error)
      setCurrentMonthTransactionsCount(0)
    }
  }

  // Carregar cartões quando a tela for aberta
  useEffect(() => {
    const loadUserCards = async () => {
      if (user) {
        try {
          await getUserCards()
        } catch (error) {
          console.error('❌ Erro ao carregar cartões no Profile:', error)
        }
      }
    }

    loadUserCards()
  }, [user?.id, getUserCards])

  // useEffect para carregar contagem de transações quando as bills forem atualizadas
  useEffect(() => {
    if (selectedCard?.bills && selectedCard.bills.length > 0) {
      loadCurrentMonthTransactionsCount()
    }
  }, [selectedCard?.bills])

  // Usar os cartões do contexto em vez de chamar getUserCards diretamente
  const userCards = cards || []

  // Verificar se o cartão está bloqueado
  const isCardBlocked = !selectedCard?.isActive

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
                {currentMonthTransactionsCount}
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
            <Text style={styles.sectionTitle}>Informações Adicionais</Text>

            <View style={styles.infoCardRow}>
              <View style={styles.infoIconCircle}>
                <IdentificationIcon width={24} height={24} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.label}>CPF</Text>
                <Text style={styles.value}>{selectedCard?.cpf}</Text>
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
                  {isCardBlocked ? (
                    <UnlockIcon color={colors.primary} width={28} height={28} />
                  ) : (
                    <LockIcon color={colors.primary} width={28} height={28} />
                  )}
                </View>
                <View>
                  <Text style={styles.actionTitle}>
                    {isCardBlocked ? 'Desbloquear Cartão' : 'Bloquear Cartão'}
                  </Text>
                  <Text style={styles.actionSubtitle}>
                    {isCardBlocked
                      ? 'Desbloqueie seu cartão para voltar a usá-lo'
                      : 'Bloqueie seu cartão por segurança'}
                  </Text>
                </View>
              </View>
              <View style={styles.chevron}>
                <ChevronRightIcon />
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
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

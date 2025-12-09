import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { UserIcon } from 'src/assets/user-icon'
import { Button } from 'src/components/button'
import { Header } from 'src/components/header'
import { useAuth } from 'src/contexts/use-auth'
import { useCard } from 'src/contexts/use-card'
import { colors } from 'src/theme/colors'

export function Profile() {
  const { user, logout } = useAuth()
  const { selectedCard, logoutCard } = useCard()

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
          <Text style={styles.sectionTitle}>Informações do Usuário</Text>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{user?.name || 'Não informado'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>E-mail:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>
              {user?.userType === 'client' ? 'Cliente' : 'Fornecedor'}
            </Text>
          </View>
        </View>

        {selectedCard && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cartão Ativo</Text>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Cartão:</Text>
              <Text style={styles.value}>
                **** {selectedCard.cardNumber.slice(-4)}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Portador:</Text>
              <Text style={styles.value}>{selectedCard.cardholderName}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Bandeira:</Text>
              <Text style={styles.value}>
                {selectedCard.brand.toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Button onPress={handleLogout} variant="secondary">
            Sair da Conta
          </Button>
        </View>
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryText,
  },
  value: {
    fontSize: 16,
    color: colors.secondaryText,
  },
})

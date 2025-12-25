import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ChatIcon } from 'src/assets/chat-icon'
import ClockIcon from 'src/assets/clock-icon'
import EarPhonesIcon from 'src/assets/ear-phones-icon'
import { LetterIcon } from 'src/assets/email'
import LocalPinIcon from 'src/assets/local-pin-icon'
import { PhoneIcon } from 'src/assets/phone-icon'
import { Header } from 'src/components/header'
import { colors } from '../../theme/colors'

const logo = require('../../../public/images/logo.png')

export function ProfileSac() {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      {/* Barra de status customizada */}
      <Header
        showBackButton
        title="Contato"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card principal */}
        <View style={styles.mainCard}>
          <Image source={logo} style={styles.mainImage} />
          <Text style={styles.mainTitle}>Estamos aqui para ajudar</Text>
          <Text style={styles.mainSubtitle}>
            Entre em contato conosco através de qualquer um dos canais abaixo
          </Text>
        </View>
        {/* Lista de canais */}
        <Text style={styles.sectionTitle}>Canais de Atendimento</Text>
        <View style={styles.channelList}>
          <View style={styles.channelCard}>
            <View
              style={[styles.channelIconCircle, { backgroundColor: '#dcfce7' }]}
            >
              <PhoneIcon color={colors.emerald[500]} />
            </View>
            <View style={styles.channelTextBox}>
              <Text style={styles.channelLabel}>Central de Atendimento</Text>
              <Text style={styles.channelValue}>0800 123 4567</Text>
              <Text style={styles.channelDesc}>
                Ligação gratuita de qualquer lugar do Brasil
              </Text>
            </View>
          </View>
          <View style={styles.channelCard}>
            <View
              style={[styles.channelIconCircle, { backgroundColor: '#d0fae5' }]}
            >
              <PhoneIcon color={colors.emerald[500]} />
            </View>
            <View style={styles.channelTextBox}>
              <Text style={styles.channelLabel}>WhatsApp</Text>
              <Text style={styles.channelValue}>(11) 98765-4321</Text>
              <Text style={styles.channelDesc}>Atendimento via mensagem</Text>
            </View>
          </View>
          <View style={styles.channelCard}>
            <View
              style={[styles.channelIconCircle, { backgroundColor: '#dbeafe' }]}
            >
              <LetterIcon width={24} height={24} color={colors.blue[500]} />
            </View>
            <View style={styles.channelTextBox}>
              <Text style={styles.channelLabel}>E-mail</Text>
              <Text style={styles.channelValue}>contato@cartoes.com.br</Text>
              <Text style={styles.channelDesc}>
                Respondemos em até 24 horas
              </Text>
            </View>
          </View>
          <View style={styles.channelCard}>
            <View
              style={[styles.channelIconCircle, { backgroundColor: '#f3e8ff' }]}
            >
              <ChatIcon color={colors.purple[500]} />
            </View>
            <View style={styles.channelTextBox}>
              <Text style={styles.channelLabel}>SAC</Text>
              <Text style={styles.channelValue}>0800 987 6543</Text>
              <Text style={styles.channelDesc}>
                Serviço de Atendimento ao Portador
              </Text>
            </View>
          </View>
        </View>

        {/* Horário de Atendimento */}
        <Text style={styles.sectionTitle}>Horário de Atendimento</Text>
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View
              style={[styles.scheduleIconCircle, { backgroundColor: '#fff' }]}
            >
              <ClockIcon width={24} height={24} strokeColor={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scheduleTitle}>Nosso horário</Text>
              <Text style={styles.scheduleSubtitle}>
                Confira quando estamos disponíveis
              </Text>
            </View>
          </View>
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleDay}>Segunda a Sexta</Text>
            <Text style={styles.scheduleHour}>08:00 às 20:00</Text>
          </View>
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleDay}>Sábados</Text>
            <Text style={styles.scheduleHour}>09:00 às 15:00</Text>
          </View>
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleDay}>Domingos e Feriados</Text>
            <Text style={styles.scheduleHour}>Fechado</Text>
          </View>
        </View>

        {/* Atendimento de Emergência */}
        <Text style={styles.sectionTitle}>Atendimento de Emergência</Text>
        <View style={styles.emergencyList}>
          <View
            style={[
              styles.emergencyCard,
              { backgroundColor: '#ffe2e2', borderColor: 'rgba(0,0,0,0.1)' },
            ]}
          >
            <View
              style={[styles.emergencyIconCircle, { backgroundColor: '#fff' }]}
            >
              <EarPhonesIcon width={24} height={24} color={colors.red[400]} />
            </View>
            <View style={styles.emergencyTextBox}>
              <Text style={[styles.emergencyTitle, { color: '#e7000b' }]}>
                Perda ou Roubo
              </Text>
              <Text style={styles.emergencyPhone}>0800 555 0000</Text>
              <Text style={styles.emergencyDesc}>Disponível 24h</Text>
            </View>
          </View>
          <View
            style={[
              styles.emergencyCard,
              { backgroundColor: '#ffedd4', borderColor: 'rgba(0,0,0,0.1)' },
            ]}
          >
            <View
              style={[styles.emergencyIconCircle, { backgroundColor: '#fff' }]}
            >
              <EarPhonesIcon
                width={24}
                height={24}
                color={colors.orange[400]}
              />
            </View>
            <View style={styles.emergencyTextBox}>
              <Text style={[styles.emergencyTitle, { color: '#f54900' }]}>
                Cancelamento de Compras
              </Text>
              <Text style={styles.emergencyPhone}>0800 555 1111</Text>
              <Text style={styles.emergencyDesc}>
                Seg a Sex, 08:00 às 22:00
              </Text>
            </View>
          </View>
        </View>

        {/* Endereço */}
        <Text style={styles.sectionTitle}>Endereço</Text>
        <View style={styles.addressCard}>
          <View
            style={[
              styles.addressIconCircle,
              { backgroundColor: colors.gray[100] },
            ]}
          >
            <LocalPinIcon width={24} height={24} color={colors.gray[500]} />
          </View>
          <View style={styles.addressTextBox}>
            <Text style={styles.addressTitle}>Sede Administrativa</Text>
            <Text style={styles.addressLine}>
              Av. Paulista, 1234 - 10º andar
            </Text>
            <Text style={styles.addressLine}>Bela Vista, São Paulo - SP</Text>
            <Text style={styles.addressLine}>CEP: 01310-100</Text>
          </View>
        </View>

        {/* Dica importante */}
        <View style={styles.tipCard}>
          <View style={styles.tipIconCircle}>
            <Text style={styles.tipIconText}>i</Text>
          </View>
          <View style={styles.tipTextBox}>
            <Text style={styles.tipTitle}>Dica importante</Text>
            <Text style={styles.tipDesc}>
              Para um atendimento mais rápido, tenha em mãos o número do seu
              cartão e documento de identidade.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#faf9f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 12,
    marginTop: 24,
  },
  statusBar: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#faf9f6',
    paddingHorizontal: 16,
  },

  statusBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBarIcon: {
    width: 22,
    height: 11,
    marginRight: 2,
  },
  statusBarSmallIcon: {
    width: 1.3,
    height: 4,
    marginRight: 2,
  },
  statusBarMidIcon: {
    width: 18,
    height: 7,
    marginRight: 8,
  },
  statusBarWifi: {
    width: 15,
    height: 11,
    marginRight: 8,
  },
  statusBarSignal: {
    width: 17,
    height: 11,
  },
  statusBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBarTime: {
    width: 54,
    height: 21,
  },
  scrollContent: {
    padding: 20,
  },
  headerIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText || '#121212',
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.45,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mainImage: {
    width: 227,
    height: 50,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 16,
    color: '#101828',
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#6a7282',
    textAlign: 'center',
    marginBottom: 10,
  },
  channelList: {
    marginTop: 8,
  },
  channelCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.45,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    marginBottom: 10,
  },
  channelIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  channelIcon: {
    width: 24,
    height: 24,
  },
  channelTextBox: {
    flex: 1,
  },
  channelLabel: {
    fontSize: 12,
    color: '#6a7282',
    marginBottom: 2,
  },
  channelValue: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  channelDesc: {
    fontSize: 12,
    color: '#6a7282',
  },

  // Horário de Atendimento
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.45,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    padding: 0,
    overflow: 'hidden',
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.45,
    borderBottomColor: colors.purple[100],
    padding: 16,
    backgroundColor: colors.purple[50],
  },
  scheduleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  scheduleTitle: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '500',
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: colors.zinc[500],
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1.45,
    borderBottomColor: colors.gray[100],
  },
  scheduleDay: {
    fontSize: 14,
    color: '#364153',
  },
  scheduleHour: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '500',
  },

  // Emergência
  emergencyList: {},
  emergencyCard: {
    borderRadius: 16,
    borderWidth: 1.45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    marginBottom: 12,
  },
  emergencyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyTextBox: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  emergencyPhone: {
    fontSize: 16,
    color: colors.primaryText,
    fontWeight: '600',
    marginBottom: 2,
  },
  emergencyDesc: {
    fontSize: 12,
    color: colors.zinc[500],
  },

  // Endereço
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.45,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 17,
    marginBottom: 16,
  },
  addressIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressTextBox: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '500',
    marginBottom: 2,
  },
  addressLine: {
    fontSize: 14,
    color: colors.zinc[500],
    marginBottom: 2,
  },

  // Dica importante
  tipCard: {
    backgroundColor: colors.purple[50],
    borderRadius: 16,
    borderWidth: 1.45,
    borderColor: colors.purple[200],
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 17,
    marginBottom: 32,
  },
  tipIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.purple[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 16,
  },
  tipTextBox: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    color: colors.purple[900],
    fontWeight: '500',
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 2,
  },
})

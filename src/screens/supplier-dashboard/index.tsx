import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CancelIcon } from 'src/assets/cancel-icon'
import { CartIcon } from 'src/assets/cart-icon'
import { ChevronRightIcon } from 'src/assets/chevron-right-icon'
import { DocumentIcon } from 'src/assets/document-icon'
import { DollarIcon } from 'src/assets/dollar-icon'
import { LogOutIcon } from 'src/assets/log-out-icon'
import { SupplierIcon } from 'src/assets/supplier-icon'
import { Header } from 'src/components/header'
import { useAuth } from 'src/contexts/use-auth'
import { ManualSale } from 'src/screens/manual-sale'
import { NewSale } from 'src/screens/new-sale'
import { QrCodeSale } from 'src/screens/qr-code-sale'
import { SalesHistory } from 'src/screens/sales-history'
import { colors } from 'src/theme/colors'

type ScreenType =
  | 'dashboard'
  | 'newSale'
  | 'manualSale'
  | 'qrCodeSale'
  | 'salesHistory'

interface SaleData {
  value: number
  installments: number
  cardNumber: string
  customerName: string
}

interface QrSaleData {
  value: number
  installments: number
}

export function SupplierDashboard() {
  const { user, logout } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard')

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sim', onPress: logout },
    ])
  }

  const handleNovaVenda = () => {
    setCurrentScreen('newSale')
  }

  const handleConsultaSaldo = () => {
    console.log('Consulta Saldo pressed')
    // TODO: Implementar navegação para Consulta de Saldo
  }

  const handleHistoricoVendas = () => {
    setCurrentScreen('salesHistory')
  }

  const handleCancelamentoVendas = () => {
    console.log('Cancelamento Vendas pressed')
    // TODO: Implementar navegação para Cancelamento de Vendas
  }

  const handleSelectManualSale = () => {
    setCurrentScreen('manualSale')
  }

  const handleSelectQrCodeSale = () => {
    setCurrentScreen('qrCodeSale')
  }

  const handleGoBackToDashboard = () => {
    setCurrentScreen('dashboard')
  }

  const handleGoBackToNewSale = () => {
    setCurrentScreen('newSale')
  }

  const handleConfirmManualSale = (saleData: SaleData) => {
    Alert.alert(
      'Venda Confirmada',
      `Venda de ${saleData.value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })} em ${saleData.installments}x para ${
        saleData.customerName
      } foi registrada com sucesso!`,
      [{ text: 'OK', onPress: handleGoBackToDashboard }]
    )
  }

  const handleConfirmQrSale = (saleData: QrSaleData) => {
    console.log('QR Code sale confirmed:', saleData)
  }

  // Render different screens based on current state
  if (currentScreen === 'newSale') {
    return (
      <NewSale
        onSelectManualSale={handleSelectManualSale}
        onSelectQrCodeSale={handleSelectQrCodeSale}
        onGoBack={handleGoBackToDashboard}
      />
    )
  }

  if (currentScreen === 'manualSale') {
    return (
      <ManualSale
        onGoBack={handleGoBackToNewSale}
        onConfirmSale={handleConfirmManualSale}
      />
    )
  }

  if (currentScreen === 'qrCodeSale') {
    return (
      <QrCodeSale
        onGoBack={handleGoBackToNewSale}
        onConfirmSale={handleConfirmQrSale}
      />
    )
  }

  if (currentScreen === 'salesHistory') {
    return <SalesHistory onGoBack={handleGoBackToDashboard} />
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Painel do fornecedor"
        icon={
          <SupplierIcon width={22} height={22} color={colors.primaryText} />
        }
      />

      {/* User Info */}
      <View style={styles.userContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.userCpf}>
            CPF:{' '}
            {user?.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOutIcon width={16} height={16} color={colors.red[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu do Fornecedor</Text>
          <Text style={styles.menuSubtitle}>Selecione a operação desejada</Text>
        </View>

        <View style={styles.menuItems}>
          {/* Nova Venda */}
          <TouchableOpacity style={styles.menuItem} onPress={handleNovaVenda}>
            <View style={[styles.iconContainer, styles.greenBackground]}>
              <CartIcon width={24} height={24} color={colors.emerald[600]} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Nova Venda</Text>
              <Text style={styles.menuItemDescription}>
                Registrar nova transação
              </Text>
            </View>
            <ChevronRightIcon width={20} height={20} color={colors.gray[400]} />
          </TouchableOpacity>

          {/* Consulta de Saldo */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleConsultaSaldo}
          >
            <View style={[styles.iconContainer, styles.yellowBackground]}>
              <DollarIcon width={24} height={24} color={colors.orange[600]} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Consulta de Saldo</Text>
              <Text style={styles.menuItemDescription}>
                Visualizar saldo do cliente
              </Text>
            </View>
            <ChevronRightIcon width={20} height={20} color={colors.gray[400]} />
          </TouchableOpacity>

          {/* Histórico de Vendas */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHistoricoVendas}
          >
            <View style={[styles.iconContainer, styles.blueBackground]}>
              <DocumentIcon width={24} height={24} color={colors.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Histórico de Vendas</Text>
              <Text style={styles.menuItemDescription}>
                Ver transações anteriores
              </Text>
            </View>
            <ChevronRightIcon width={20} height={20} color={colors.gray[400]} />
          </TouchableOpacity>

          {/* Cancelamento de Vendas */}
          <TouchableOpacity
            style={[styles.menuItem, styles.cancelMenuItem]}
            onPress={handleCancelamentoVendas}
          >
            <View style={[styles.iconContainer, styles.redBackground]}>
              <CancelIcon width={24} height={24} color={colors.red[500]} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Cancelamento de Vendas</Text>
              <Text style={styles.menuItemDescription}>
                Cancelar transações existentes
              </Text>
            </View>
            <ChevronRightIcon width={20} height={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  userContainer: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    width: '100%',
    maxWidth: 363,
    alignSelf: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userCpf: {
    fontSize: 14.5,
    color: colors.gray[500],
    fontWeight: '400',
  },
  logoutButton: {
    backgroundColor: colors.red[100],
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    paddingHorizontal: 6,
    width: '100%',
    maxWidth: 363,
    alignSelf: 'center',
  },
  menuHeader: {
    paddingVertical: 12,
    gap: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryText,
    lineHeight: 24,
  },
  menuSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray[500],
    lineHeight: 20,
  },
  menuItems: {
    gap: 12,
    paddingTop: 12,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.45,
    borderColor: colors.gray[200],
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 82.9,
  },
  cancelMenuItem: {
    minHeight: 12.9,
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenBackground: {
    backgroundColor: '#dcfce7',
  },
  yellowBackground: {
    backgroundColor: '#fcfbdc',
  },
  blueBackground: {
    backgroundColor: '#dbeafe',
  },
  redBackground: {
    backgroundColor: colors.red[100],
  },
  menuItemContent: {
    flex: 1,
    gap: 2,
    alignSelf: 'flex-start',
    paddingTop: 4,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#101828',
    lineHeight: 24,
  },
  menuItemDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray[500],
    lineHeight: 20,
    flexWrap: 'wrap',
  },
})

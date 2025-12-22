import React, { useMemo, useState } from 'react'
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import {
  CancellableSaleItem,
  CancellableSaleItemProps,
} from 'src/components/cancellable-sale-item'
import { Header } from 'src/components/header'
import { SaleCancellationSheet } from 'src/components/sale-cancellation-sheet'
import { colors } from 'src/theme/colors'

type SearchType = 'nsu' | 'card' | 'date'

// Mapeamento dos motivos de cancelamento
const cancellationReasons = [
  { label: 'Solicitação do cliente', value: 'customer_request' },
  { label: 'Transação duplicada', value: 'duplicate_transaction' },
  { label: 'Valor incorreto', value: 'incorrect_amount' },
  { label: 'Cartão incorreto', value: 'incorrect_card' },
  { label: 'Outro motivo', value: 'other' },
]

const getCancellationReasonLabel = (value: string) => {
  const reason = cancellationReasons.find((r) => r.value === value)
  return reason ? reason.label : 'Motivo não especificado'
}

// Mock data - será substituído por dados reais
const mockSales: CancellableSaleItemProps[] = [
  {
    id: 'VND001233',
    customerName: 'João Silva Santos',
    cardNumber: '**** **** **** 1234',
    amount: 150.0,
    installments: 1,
    date: '22/12/2024 às 14:35',
    nsu: '000123456',
    authCode: 'AUTH123456',
    status: 'authorized',
    onCancel: () => {},
  },
  {
    id: 'VND001232',
    customerName: 'Maria Oliveira Costa',
    cardNumber: '**** **** **** 5678',
    amount: 89.9,
    installments: 1,
    date: '22/12/2024 às 13:20',
    nsu: '000789012',
    authCode: 'AUTH789012',
    status: 'authorized',
    onCancel: () => {},
  },
  {
    id: 'VND001231',
    customerName: 'Pedro Alves Mendes',
    cardNumber: '**** **** **** 9012',
    amount: 234.5,
    installments: 1,
    date: '22/12/2024 às 11:45',
    nsu: '000345678',
    authCode: 'AUTH345678',
    status: 'authorized',
    onCancel: () => {},
  },
  {
    id: 'VND001230',
    customerName: 'Ana Paula Ferreira',
    cardNumber: '**** **** **** 3456',
    amount: 567.8,
    installments: 1,
    date: '21/12/2024 às 16:10',
    nsu: '000901234',
    authCode: 'AUTH901234',
    status: 'cancelled',
    cancellationReason: 'Solicitação do cliente',
    onCancel: () => {},
  },
  {
    id: 'VND001229',
    customerName: 'Carlos Eduardo Lima',
    cardNumber: '**** **** **** 7890',
    amount: 45.0,
    installments: 1,
    date: '21/12/2024 às 10:30',
    nsu: '000567890',
    authCode: 'AUTH567890',
    status: 'authorized',
    onCancel: () => {},
  },
]

interface SalesCancellationProps {
  onGoBack?: () => void
}

export function SalesCancellation({ onGoBack }: SalesCancellationProps) {
  const [searchText, setSearchText] = useState('')
  const [activeSearchType, setActiveSearchType] = useState<SearchType>('nsu')
  const [showCancellationSheet, setShowCancellationSheet] = useState(false)
  const [selectedSale, setSelectedSale] =
    useState<CancellableSaleItemProps | null>(null)
  const [sales, setSales] = useState(mockSales)

  const filteredSales = useMemo(() => {
    if (!searchText.trim()) {
      return sales
    }

    const searchLower = searchText.toLowerCase()
    return sales.filter((sale) => {
      switch (activeSearchType) {
        case 'nsu':
          return sale.nsu.toLowerCase().includes(searchLower)
        case 'card':
          return sale.cardNumber.toLowerCase().includes(searchLower)
        case 'date':
          return sale.date.toLowerCase().includes(searchLower)
        default:
          return true
      }
    })
  }, [searchText, activeSearchType, sales])

  const handleCancelSale = (sale: CancellableSaleItemProps) => {
    if (sale.status === 'cancelled') return
    setSelectedSale(sale)
    setShowCancellationSheet(true)
  }

  const handleConfirmCancellation = (reason: string) => {
    if (!selectedSale) return

    const reasonLabel = getCancellationReasonLabel(reason)

    // Update sale status to cancelled
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === selectedSale.id
          ? {
              ...sale,
              status: 'cancelled' as const,
              cancellationReason: reasonLabel,
            }
          : sale
      )
    )

    setShowCancellationSheet(false)
    setSelectedSale(null)

    // Show success alert
    Alert.alert(
      'Venda Cancelada',
      `A venda ${selectedSale.id} foi cancelada com sucesso. O valor será estornado automaticamente no cartão do cliente.`,
      [{ text: 'OK' }]
    )
  }

  const handleCancelCancellation = () => {
    setShowCancellationSheet(false)
    setSelectedSale(null)
  }

  const getSearchPlaceholder = () => {
    switch (activeSearchType) {
      case 'nsu':
        return 'Buscar por NSU'
      case 'card':
        return 'Buscar por número do cartão'
      case 'date':
        return 'Buscar por data'
      default:
        return 'Buscar'
    }
  }

  const renderSaleItem = ({ item }: { item: CancellableSaleItemProps }) => (
    <CancellableSaleItem {...item} onCancel={() => handleCancelSale(item)} />
  )

  const renderFilterButton = (type: SearchType, label: string) => {
    const isActive = activeSearchType === type
    return (
      <TouchableOpacity
        key={type}
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive ? colors.primary : 'white',
            borderColor: isActive ? colors.primary : '#d1d5dc',
          },
        ]}
        onPress={() => setActiveSearchType(type)}
      >
        <Text
          style={[
            styles.filterButtonText,
            { color: isActive ? 'white' : '#364153' },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderEmptyComponent = () => (
    <View style={styles.emptyState}>
      <DocumentIcon width={48} height={48} color={colors.gray[300]} />
      <Text style={styles.emptyTitle}>Nenhuma venda encontrada</Text>
      <Text style={styles.emptyDescription}>
        Não há vendas que correspondam aos filtros aplicados
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header
        title="Cancelamento de Vendas"
        showBackButton={true}
        onBackPress={onGoBack}
      />

      <View style={styles.content}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {renderFilterButton('nsu', 'NSU')}
          {renderFilterButton('card', 'Cartão')}
          {renderFilterButton('date', 'Data')}
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <DocumentIcon width={20} height={20} color={colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder={getSearchPlaceholder()}
              placeholderTextColor="#99a1af"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Info Alert */}
        <View style={styles.alertContainer}>
          <DocumentIcon width={20} height={20} color="#1c398e" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Importante</Text>
            <Text style={styles.alertDescription}>
              Você pode cancelar vendas realizadas em até 24 horas. O valor será
              estornado automaticamente no cartão do cliente.
            </Text>
          </View>
        </View>

        {/* Sales List */}
        <FlatList
          data={filteredSales}
          renderItem={renderSaleItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.salesList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>

      {/* Cancellation Confirmation Sheet */}
      {selectedSale && (
        <SaleCancellationSheet
          visible={showCancellationSheet}
          saleData={{
            amount: selectedSale.amount,
            installments: selectedSale.installments,
            cardNumber: selectedSale.cardNumber,
            nsu: selectedSale.nsu,
          }}
          onCancel={handleCancelCancellation}
          onConfirm={handleConfirmCancellation}
        />
      )}
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
    padding: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.483,
    height: 38.967,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 25,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.483,
    borderColor: '#d1d5dc',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 51,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arimo_400Regular',
    color: '#101828',
  },
  alertContainer: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.483,
    borderColor: '#bedbff',
    borderRadius: 14,
    padding: 17.483,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 25,
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontSize: 14,
    color: '#1c398e',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  alertDescription: {
    fontSize: 12,
    color: '#1447e6',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 19.5,
  },
  salesList: {
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[600],
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
})

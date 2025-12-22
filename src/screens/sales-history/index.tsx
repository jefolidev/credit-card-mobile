import React, { useMemo, useState } from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import { Header } from 'src/components/header'
import { SaleItem, SaleItemProps, SaleStatus } from 'src/components/sale-item'
import { colors } from 'src/theme/colors'

type FilterStatus = 'all' | SaleStatus

interface FilterButton {
  key: FilterStatus
  label: string
  count: number
}

const mockSales: SaleItemProps[] = [
  {
    id: 'VND001233',
    customerName: 'Maria Santos',
    cardNumber: '6050 **** **** 8392',
    amount: 89.9,
    installments: 1,
    date: '15/12/2024 às 13:15',
    status: 'authorized',
  },
  {
    id: 'VND001232',
    customerName: 'Carlos Oliveira',
    cardNumber: '6050 **** **** 1543',
    amount: 450.0,
    installments: 6,
    date: '15/12/2024 às 11:48',
    status: 'unauthorized',
  },
  {
    id: 'VND001231',
    customerName: 'Ana Silva',
    cardNumber: '6050 **** **** 7821',
    amount: 125.5,
    installments: 3,
    date: '14/12/2024 às 16:22',
    status: 'authorized',
  },
  {
    id: 'VND001230',
    customerName: 'Pedro Costa',
    cardNumber: '6050 **** **** 9834',
    amount: 680.0,
    installments: 12,
    date: '14/12/2024 às 15:10',
    status: 'cancelled',
  },
  {
    id: 'VND001229',
    customerName: 'Lucia Ferreira',
    cardNumber: '6050 **** **** 4567',
    amount: 89.0,
    installments: 1,
    date: '13/12/2024 às 09:30',
    status: 'authorized',
  },
  {
    id: 'VND001228',
    customerName: 'Roberto Mendes',
    cardNumber: '6050 **** **** 2341',
    amount: 320.0,
    installments: 4,
    date: '12/12/2024 às 14:15',
    status: 'unauthorized',
  },
  {
    id: 'VND001227',
    customerName: 'Fernanda Lima',
    cardNumber: '6050 **** **** 8765',
    amount: 200.0,
    installments: 2,
    date: '12/12/2024 às 10:45',
    status: 'authorized',
  },
  {
    id: 'VND001226',
    customerName: 'José Santos',
    cardNumber: '6050 **** **** 9012',
    amount: 150.75,
    installments: 1,
    date: '11/12/2024 às 18:30',
    status: 'unauthorized',
  },
]

interface SalesHistoryProps {
  onGoBack?: () => void
}

export function SalesHistory({ onGoBack }: SalesHistoryProps) {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all')

  const filteredSales = useMemo(() => {
    let sales = mockSales

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase()
      sales = sales.filter(
        (sale) =>
          sale.id.toLowerCase().includes(searchLower) ||
          sale.customerName.toLowerCase().includes(searchLower) ||
          sale.cardNumber.toLowerCase().includes(searchLower)
      )
    }

    if (activeFilter !== 'all') {
      sales = sales.filter((sale) => sale.status === activeFilter)
    }

    return sales
  }, [searchText, activeFilter])

  const getFilterButtons = (): FilterButton[] => {
    const authorizedCount = mockSales.filter(
      (sale) => sale.status === 'authorized'
    ).length
    const unauthorizedCount = mockSales.filter(
      (sale) => sale.status === 'unauthorized'
    ).length
    const cancelledCount = mockSales.filter(
      (sale) => sale.status === 'cancelled'
    ).length

    return [
      {
        key: 'all',
        label: `Todas (${mockSales.length})`,
        count: mockSales.length,
      },
      {
        key: 'authorized',
        label: `Autorizadas (${authorizedCount})`,
        count: authorizedCount,
      },
      {
        key: 'unauthorized',
        label: `Não Autorizadas (${unauthorizedCount})`,
        count: unauthorizedCount,
      },
      {
        key: 'cancelled',
        label: `Canceladas (${cancelledCount})`,
        count: cancelledCount,
      },
    ]
  }

  const renderSaleItem = ({ item }: { item: SaleItemProps }) => (
    <SaleItem {...item} />
  )

  const getFilterButtonColors = (
    buttonKey: FilterStatus,
    isActive: boolean
  ) => {
    if (!isActive) {
      return {
        backgroundColor: colors.gray[100],
        textColor: colors.gray[700],
      }
    }

    switch (buttonKey) {
      case 'all':
        return {
          backgroundColor: colors.primary,
          textColor: 'white',
        }
      case 'authorized':
        return {
          backgroundColor: '#008236',
          textColor: 'white',
        }
      case 'unauthorized':
        return {
          backgroundColor: '#c10007',
          textColor: 'white',
        }
      case 'cancelled':
        return {
          backgroundColor: colors.gray[600],
          textColor: 'white',
        }
      default:
        return {
          backgroundColor: colors.primary,
          textColor: 'white',
        }
    }
  }

  const renderFilterButton = (button: FilterButton) => {
    const isActive = activeFilter === button.key
    const colors_config = getFilterButtonColors(button.key, isActive)

    return (
      <TouchableOpacity
        key={button.key}
        style={[
          styles.filterButton,
          {
            backgroundColor: colors_config.backgroundColor,
          },
        ]}
        onPress={() => setActiveFilter(button.key)}
      >
        <Text
          style={[styles.filterButtonText, { color: colors_config.textColor }]}
        >
          {button.label}
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
        title="Histórico de vendas"
        showBackButton={true}
        onBackPress={onGoBack}
      />

      <View style={styles.content}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Vendas realizadas</Text>
          <Text style={styles.subtitle}>{mockSales.length} transações</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <DocumentIcon width={16} height={16} color={colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por ID, cartão ou cliente..."
              placeholderTextColor="rgba(16,24,40,0.5)"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContentContainer}
        >
          {getFilterButtons().map(renderFilterButton)}
        </ScrollView>

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
    paddingHorizontal: 12,
    paddingVertical: 17,
  },
  headerInfo: {
    paddingHorizontal: 12,
    paddingTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6a7282',
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1.45,
    borderColor: '#d1d5dc',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    height: 51,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arimo_400Regular',
    color: '#101828',
  },
  filterContainer: {
    marginBottom: 20,
    minHeight: 42,
  },
  filterContentContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 'auto',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Arimo_400Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  salesList: {
    paddingHorizontal: 0,
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

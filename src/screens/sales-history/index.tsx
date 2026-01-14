import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { DocumentIcon } from 'src/assets/document-icon'
import { FilterIcon } from 'src/assets/filter-icon'
import { FilterPanel } from 'src/components'
import { Header } from 'src/components/header'
import { SaleItem, SaleItemProps, SaleStatus } from 'src/components/sale-item'
import { useAuth } from 'src/contexts/use-auth'
import { useSells } from 'src/contexts/use-sells'
import { ResponseGetSell } from 'src/services/sells/responses.dto'
import { colors } from 'src/theme/colors'
import { parseCurrencyToNumber } from 'src/utils'

type FilterStatus = 'all' | SaleStatus

interface FilterButton {
  key: FilterStatus
  label: string
  count: number
}

interface AdvancedFilters {
  description: string
  minAmount: string
  maxAmount: string
  startDate: string
  endDate: string
  cardNumber: string
  asc: boolean
  status?: 'PAID' | 'IN_CANCELATION' | 'CANCELED'
}

interface SalesHistoryProps {
  onGoBack?: () => void
}

export function SalesHistory({ onGoBack }: SalesHistoryProps) {
  const { user } = useAuth()
  const { getSells } = useSells()
  const [allSales, setAllSales] = useState<ResponseGetSell[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const { control, watch, reset } = useForm<AdvancedFilters>({
    defaultValues: {
      description: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      cardNumber: '',
      asc: true,
    },
  })

  const searchText = watch('description')
  const advancedFilters = useWatch({ control })

  const parseDate = (dateString: string): Date | null => {
    if (!dateString || dateString.length !== 10) return null
    const [day, month, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return isNaN(date.getTime()) ? null : date
  }

  const convertToISODate = (
    dateString: string,
    isEndDate = false
  ): string | undefined => {
    if (!dateString || dateString.length !== 10) return undefined
    const [day, month, year] = dateString.split('/')

    if (isEndDate) {
      // Para data final, inclui o final do dia (23:59:59.999Z)
      return `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}T23:59:59.999Z`
    } else {
      // Para data inicial, usa o início do dia (00:00:00.000Z)
      return `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}T00:00:00.000Z`
    }
  }

  const fetchSales = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const startDateISO = advancedFilters.startDate
        ? convertToISODate(advancedFilters.startDate, false)
        : undefined
      const endDateISO = advancedFilters.endDate
        ? convertToISODate(advancedFilters.endDate, true)
        : undefined

      const filters = {
        userId: user.id,
        minAmount: advancedFilters.minAmount
          ? parseCurrencyToNumber(advancedFilters.minAmount).toString()
          : undefined,
        maxAmount: advancedFilters.maxAmount
          ? parseCurrencyToNumber(advancedFilters.maxAmount).toString()
          : undefined,
        ...(startDateISO && { startDate: startDateISO }),
        ...(endDateISO && { endDate: endDateISO }),
        asc: advancedFilters.asc,
        limit: '50',
        page: '1',
      }

      const response = await getSells(filters)
      setAllSales(response.sells || [])
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      setAllSales([])
    } finally {
      setLoading(false)
    }
  }, [
    user?.id,
    advancedFilters.minAmount,
    advancedFilters.maxAmount,
    advancedFilters.startDate,
    advancedFilters.endDate,
    advancedFilters.asc,
    // Removido activeFilter da dependência
  ])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const filteredSales = useMemo(() => {
    let filteredData = allSales

    // Aplicar filtro de status
    if (activeFilter !== 'all') {
      filteredData = filteredData.filter((sale) => sale.status === activeFilter)
    }

    // Aplicar filtro de busca por texto
    if (searchText?.trim()) {
      const searchLower = searchText.toLowerCase()
      filteredData = filteredData.filter(
        (sale) =>
          sale.description?.toLowerCase().includes(searchLower) ||
          sale.id.toLowerCase().includes(searchLower) ||
          sale.card?.user?.name?.toLowerCase().includes(searchLower) ||
          sale.card?.cardNumber?.toLowerCase().includes(searchLower)
      )
    }

    return filteredData
  }, [allSales, searchText, activeFilter])

  const clearAdvancedFilters = () => {
    reset({
      description: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      cardNumber: '',
      asc: true,
    })
  }

  const hasActiveAdvancedFilters = Object.entries(advancedFilters).some(
    ([key, value]) => {
      if (key === 'asc') return false
      return value !== '' && value !== true && value !== false
    }
  )

  const getFilterButtons = (): FilterButton[] => {
    const authorizedCount = allSales.filter(
      (sale) => sale.status === 'PAID'
    ).length
    const inCancellationCount = allSales.filter(
      (sale) => sale.status === 'IN_CANCELATION'
    ).length
    const cancelledCount = allSales.filter(
      (sale) => sale.status === 'CANCELED'
    ).length

    return [
      {
        key: 'all',
        label: `Todas (${allSales.length})`,
        count: allSales.length,
      },
      {
        key: 'PAID',
        label: `Autorizadas (${authorizedCount})`,
        count: authorizedCount,
      },
      {
        key: 'CANCELED',
        label: `Canceladas (${cancelledCount})`,
        count: cancelledCount,
      },
      {
        key: 'IN_CANCELATION',
        label: `Em cancelamento (${inCancellationCount})`,
        count: inCancellationCount,
      },
    ]
  }

  const renderSaleItem = ({ item }: { item: ResponseGetSell }) => {
    const saleProps: SaleItemProps = {
      id: item.id,
      customerName: item.card?.user?.name || 'N/A',
      cardNumber: item.card?.cardNumber || 'N/A',
      amount: item.amount,
      installments: item.installments,
      date:
        new Date(item.createdAt).toLocaleDateString('pt-BR') +
        ' às ' +
        new Date(item.createdAt).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      status: item.status,
    }
    return <SaleItem {...saleProps} />
  }

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
      case 'PAID':
        return {
          backgroundColor: '#008236',
          textColor: 'white',
        }
      case 'CANCELED':
        return {
          backgroundColor: '#c10007',
          textColor: 'white',
        }
      case 'IN_CANCELATION':
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Vendas realizadas</Text>
            <Text style={styles.subtitle}>{allSales.length} transações</Text>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <DocumentIcon width={16} height={16} color={colors.gray[400]} />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por descrição, cartão ou portador..."
                    placeholderTextColor="rgba(16,24,40,0.5)"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.filterToggleButton,
                hasActiveAdvancedFilters && styles.filterToggleButtonActive,
              ]}
              onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FilterIcon
                width={20}
                height={20}
                color={hasActiveAdvancedFilters ? 'white' : colors.gray[600]}
              />
            </TouchableOpacity>
          </View>

          {/* Advanced Filters Panel */}
          <FilterPanel
            control={control}
            visible={showAdvancedFilters}
            onClear={clearAdvancedFilters}
            showAllFields={true}
          />

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContentContainer}
          >
            {getFilterButtons().map(renderFilterButton)}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* Sales List */}
      <FlatList
        data={filteredSales}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.salesListContainer}
        contentContainerStyle={styles.salesList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyComponent}
        nestedScrollEnabled={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arimo_400Regular',
    color: '#101828',
  },
  filterToggleButton: {
    width: 51,
    height: 51,
    backgroundColor: '#f9fafb',
    borderWidth: 1.45,
    borderColor: '#d1d5dc',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterContainer: {
    marginBottom: 4,
    maxHeight: 36,
  },
  filterContentContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
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
  salesListContainer: {
    flex: 1,
    paddingHorizontal: 12,
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

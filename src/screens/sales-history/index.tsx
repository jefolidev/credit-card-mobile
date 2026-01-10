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
import { DateInput } from 'src/components'
import { Header } from 'src/components/header'
import { SaleItem, SaleItemProps, SaleStatus } from 'src/components/sale-item'
import { useAuth } from 'src/contexts/use-auth'
import { useSells } from 'src/contexts/use-sells'
import { ResponseGetSell } from 'src/services/sells/responses.dto'
import { colors } from 'src/theme/colors'
import { formatCurrency, parseCurrencyToNumber } from 'src/utils'

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
  const [sales, setSales] = useState<ResponseGetSell[]>([])
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

  // Função para converter string de data para Date
  const parseDate = (dateString: string): Date | null => {
    if (!dateString || dateString.length !== 10) return null
    const [day, month, year] = dateString.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return isNaN(date.getTime()) ? null : date
  }

  const fetchSales = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const filters = {
        userId: user.id,
        // Não enviar description para API, fazer busca local apenas
        minAmount: advancedFilters.minAmount
          ? parseCurrencyToNumber(advancedFilters.minAmount).toString()
          : undefined,
        maxAmount: advancedFilters.maxAmount
          ? parseCurrencyToNumber(advancedFilters.maxAmount).toString()
          : undefined,
        startDate: advancedFilters.startDate || undefined,
        endDate: advancedFilters.endDate || undefined,
        status: activeFilter !== 'all' ? activeFilter : undefined,
        asc: advancedFilters.asc,
        limit: '50',
        page: '1',
      }

      const response = await getSells(filters)
      setSales(response.sells || [])
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      setSales([])
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
    activeFilter,
  ])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const filteredSales = useMemo(() => {
    let filteredData = sales

    // Aplicar busca local por descrição, número do cartão ou portador
    if (searchText?.trim()) {
      const searchLower = searchText.toLowerCase()
      filteredData = sales.filter(
        (sale) =>
          // Buscar na descrição (se existir)
          sale.description?.toLowerCase().includes(searchLower) ||
          // Buscar no ID da venda
          sale.id.toLowerCase().includes(searchLower) ||
          // Buscar no nome do portador
          sale.card?.user?.name?.toLowerCase().includes(searchLower) ||
          // Buscar no número do cartão
          sale.card?.cardNumber?.toLowerCase().includes(searchLower)
      )
    }

    return filteredData
  }, [sales, searchText])

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
      if (key === 'asc') return false // Não considerar 'asc' como filtro ativo
      return value !== '' && value !== true && value !== false
    }
  )

  const getFilterButtons = (): FilterButton[] => {
    const authorizedCount = sales.filter(
      (sale) => sale.status === 'PAID'
    ).length
    const unauthorizedCount = sales.filter(
      (sale) => sale.status === 'IN_CANCELATION'
    ).length
    const cancelledCount = sales.filter(
      (sale) => sale.status === 'CANCELED'
    ).length

    return [
      {
        key: 'all',
        label: `Todas (${sales.length})`,
        count: sales.length,
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
            <Text style={styles.subtitle}>{sales.length} transações</Text>
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
          {showAdvancedFilters && (
            <View style={styles.advancedFiltersPanel}>
              <View style={styles.advancedFiltersHeader}>
                <Text style={styles.advancedFiltersTitle}>
                  Filtros avançados
                </Text>
                <TouchableOpacity onPress={clearAdvancedFilters}>
                  <Text style={styles.clearFiltersText}>Limpar filtros</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filtersRow}>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { onChange, value } }) => (
                    <DateInput
                      label="Data inicial"
                      value={value}
                      onChange={onChange}
                      placeholder="DD/MM/AAAA"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { onChange, value } }) => (
                    <DateInput
                      label="Data final"
                      value={value}
                      onChange={onChange}
                      placeholder="DD/MM/AAAA"
                    />
                  )}
                />
              </View>

              <View style={styles.filtersRow}>
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Valor mínimo</Text>
                  <Controller
                    control={control}
                    name="minAmount"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.filterInput}
                        placeholder="R$ 0,00"
                        value={value}
                        onChangeText={(text: string) => {
                          const formatted = formatCurrency(text)
                          onChange(formatted)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Valor máximo</Text>
                  <Controller
                    control={control}
                    name="maxAmount"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.filterInput}
                        placeholder="R$ 999,99"
                        value={value}
                        onChangeText={(text: string) => {
                          const formatted = formatCurrency(text)
                          onChange(formatted)
                        }}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>

              <View style={styles.filtersRow}>
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Número do cartão</Text>
                  <Controller
                    control={control}
                    name="cardNumber"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.filterInput}
                        placeholder="6050 **** **** 1234"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        maxLength={19}
                      />
                    )}
                  />
                </View>
              </View>

              <View style={styles.filtersRow}>
                <View style={styles.filterItem}>
                  <Text style={styles.filterLabel}>Ordenação por valor</Text>
                  <Controller
                    control={control}
                    name="asc"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.sortButtons}>
                        <TouchableOpacity
                          style={[
                            styles.sortButton,
                            value && styles.sortButtonActive,
                          ]}
                          onPress={() => onChange(true)}
                        >
                          <Text
                            style={[
                              styles.sortButtonText,
                              value && styles.sortButtonTextActive,
                            ]}
                          >
                            Crescente
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.sortButton,
                            !value && styles.sortButtonActive,
                          ]}
                          onPress={() => onChange(false)}
                        >
                          <Text
                            style={[
                              styles.sortButtonText,
                              !value && styles.sortButtonTextActive,
                            ]}
                          >
                            Decrescente
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          )}

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
  advancedFiltersPanel: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  advancedFiltersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  advancedFiltersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    fontFamily: 'Arimo_600SemiBold',
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Arimo_400Regular',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Arimo_400Regular',
    marginBottom: 8,
    fontWeight: '500',
  },
  filterInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5dc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#101828',
    fontFamily: 'Arimo_400Regular',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Arimo_400Regular',
  },
  sortButtonTextActive: {
    color: 'white',
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

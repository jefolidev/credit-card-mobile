import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import { FilterIcon } from 'src/assets/filter-icon'
import { FilterPanel } from 'src/components'
import {
  CancellableSaleItem,
  CancellableSaleItemProps,
} from 'src/components/cancellable-sale-item'
import { Header } from 'src/components/header'
import { SaleCancellationSheet } from 'src/components/sale-cancellation-sheet'
import { useAuth } from 'src/contexts/use-auth'
import { useSells } from 'src/contexts/use-sells'
import { ResponseGetSell } from 'src/services/sells/responses.dto'
import { colors } from 'src/theme/colors'

interface SaleCancellationFilters {
  cardNumber: string
}

const cancellationReasons = [
  { label: 'Solicitação do portador', value: 'HOLDER_REQUEST' },
  { label: 'Transação duplicada', value: 'DUPLICATE_TRANSACTION' },
  { label: 'Valor incorreto', value: 'INCORRECT_AMOUNT' },
  { label: 'Cartão incorreto', value: 'INCORRECT_CARD' },
  { label: 'Outro motivo', value: 'OTHER_REASON' },
]

const getCancellationReasonLabel = (value: string) => {
  const reason = cancellationReasons.find((r) => r.value === value)
  return reason ? reason.label : 'Motivo não especificado'
}

const mapSellToSaleItem = (
  sell: ResponseGetSell
): CancellableSaleItemProps => ({
  id: sell.id,
  customerName: sell.card.user.name || '',
  cardNumber: sell.card.cardNumber || '**** **** **** ****',
  amount: sell.amount,
  installments: sell.installments || 1,
  date: sell.createdAt,
  authCode: '',
  status: sell.status,
  cancelReason: sell.cancelReason || undefined,
  canceledAt: sell.canceledAt || undefined,
  onCancel: () => {},
})

interface SalesCancellationProps {
  onGoBack?: () => void
}

export function SalesCancellation({ onGoBack }: SalesCancellationProps) {
  const { user } = useAuth()
  const { getSells, cancelSell } = useSells()

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedSale, setSelectedSale] =
    useState<CancellableSaleItemProps | null>(null)
  const [showCancellationSheet, setShowCancellationSheet] = useState(false)
  const [sales, setSales] = useState<ResponseGetSell[]>([])
  const [loading, setLoading] = useState(false)

  const { control, watch, reset } = useForm<SaleCancellationFilters>({
    defaultValues: {
      cardNumber: '',
    },
  })

  const cardNumber = watch('cardNumber')

  const fetchSales = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const filters = {
        userId: user.id,
      }

      const response = await getSells(filters)
      setSales(response.sells)
    } catch (error) {
      console.error('❌ Erro ao buscar vendas:', error)
      Alert.alert(
        'Erro',
        'Não foi possível carregar as vendas. Tente novamente.',
        [{ text: 'OK' }]
      )
    } finally {
      setLoading(false)
    }
  }, [user?.id, getSells])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const salesItems = useMemo(() => sales.map(mapSellToSaleItem), [sales])

  const filteredSales = useMemo(() => {
    let filteredData = salesItems

    if (cardNumber?.trim()) {
      const searchLower = cardNumber.toLowerCase()
      filteredData = salesItems.filter((sale) =>
        sale.cardNumber.toLowerCase().includes(searchLower)
      )
    }

    return filteredData
  }, [cardNumber, salesItems])

  const clearAdvancedFilters = () => {
    reset({
      cardNumber: '',
    })
  }

  const hasActiveAdvancedFilters = !!cardNumber?.trim()

  const handleCancelSale = (sale: CancellableSaleItemProps) => {
    if (sale.status === 'CANCELED') return
    setSelectedSale(sale)
    setShowCancellationSheet(true)
  }

  const handleConfirmCancellation = async (reason: string) => {
    if (!selectedSale) return

    try {
      await cancelSell(selectedSale.id, { reason })

      await fetchSales()

      setShowCancellationSheet(false)
      setSelectedSale(null)

      Alert.alert(
        'Venda Cancelada',
        `A venda ${selectedSale.id} foi cancelada com sucesso. O valor será estornado automaticamente no cartão do portador.`,
        [{ text: 'OK' }]
      )
    } catch (error) {
      console.error('❌ Erro ao cancelar venda:', error)
      Alert.alert(
        'Erro',
        'Não foi possível cancelar a venda. Tente novamente.',
        [{ text: 'OK' }]
      )
    }
  }

  const handleCancelCancellation = () => {
    setShowCancellationSheet(false)
    setSelectedSale(null)
  }

  const renderSaleItem = ({ item }: { item: CancellableSaleItemProps }) => (
    <CancellableSaleItem {...item} onCancel={() => handleCancelSale(item)} />
  )

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
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <DocumentIcon width={20} height={20} color={colors.gray[400]} />
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar por número do cartão..."
                  placeholderTextColor="#99a1af"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  maxLength={19}
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
          showAllFields={false}
        />

        {/* Info Alert */}
        <View style={styles.alertContainer}>
          <DocumentIcon width={20} height={20} color="#1c398e" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Importante</Text>
            <Text style={styles.alertDescription}>
              Você pode cancelar vendas realizadas em até 24 horas. O valor será
              estornado automaticamente no cartão do portador.
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
          refreshing={loading}
          onRefresh={fetchSales}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    backgroundColor: 'white',
    borderWidth: 1.483,
    borderColor: '#d1d5dc',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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

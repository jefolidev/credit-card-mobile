import { createContext, ReactNode, useContext, useState } from 'react'
import { BillStatus } from 'src/components/cash-amount'
import { cardsServices } from 'src/services/cards/endpoints'
import {
  ResponseAuthCard,
  ResponseGetAllCardsUser,
  ResponseGetBillingDetails,
  ResponseGetBillingsCards,
  ResponseGetPortatorBalance,
} from 'src/services/cards/responses-dto'
import AuthCardDTO from 'src/services/cards/validations/auth-card-dto'
import { setCardAuthToken } from '../api/api'

export interface Transaction {
  id: string
  title: string
  amount: number
  date: string
  type: 'transfer' | 'payment'
}

export interface Bill {
  id: string
  month: string
  year: number
  amount: number
  dueDate: string
  closingDate: string
  status: BillStatus
  cardId: string
  transactions: Transaction[]
}

export interface CreditCard {
  id: string
  cardNumber: string
  cpf: string
  cardholderName: string
  totalLimit: number
  limitAvailable: number
  type: 'credit' | 'debit'
  isActive: boolean
  closingDate: number
  dueDate: number
  period: string
  creditReturnDate: number
  estimatedBilling: number
  bills: Bill[]
}

interface CardContextProps {
  cards: CreditCard[]
  selectedCard: CreditCard | null
  isCardAuthenticated: boolean
  isCardLoading: boolean
  isCurrentCardBlocked: boolean
  selectCard: (card: CreditCard) => void
  authenticateCard: (cardId: string, password: string) => Promise<boolean>
  logoutCard: () => void
  getUserCards: () => Promise<ResponseGetAllCardsUser>
  checkCardBlockStatus: () => Promise<ResponseGetAllCardsUser>
  getPortatorBalance: () => Promise<ResponseGetPortatorBalance>
  getPortatorBalanceBySearch: (searchParams: {
    cpf?: string
    cardNumber?: string
  }) => Promise<ResponseGetPortatorBalance>
  getCardBillings: () => Promise<ResponseGetBillingsCards>
  getBillingDetails: (billingId: string) => Promise<ResponseGetBillingDetails>
  changeCardPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>
  blockCard: () => Promise<boolean>
  unblockCard: () => Promise<boolean>
}

const CardContext = createContext<CardContextProps | null>(null)

export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [isCurrentCardBlocked, setIsCurrentCardBlocked] = useState(false)

  const [isCardAuthenticated, setIsCardAuthenticated] = useState(false)
  const [isCardLoading, setIsCardLoading] = useState(false)
  const [cardToken, setCardToken] = useState<string | null>(null)

  const selectCard = (card: CreditCard) => {
    if (!selectedCard || selectedCard.id !== card.id) {
      setSelectedCard(card)
      setIsCardAuthenticated(false)
      setCardToken(null)
    }
  }

  const authenticateCard = async (
    cardId: string,
    password: string
  ): Promise<boolean> => {
    setIsCardLoading(true)

    try {
      const authData: AuthCardDTO = {
        cardId,
        password,
      }

      const response: ResponseAuthCard = await cardsServices.authCard(authData)

      if (response.token) {
        setCardToken(response.token)
        setCardAuthToken(response.token)
        setIsCardAuthenticated(true)

        // Automaticamente carrega o saldo após autenticação
        try {
          const balanceResponse = await getPortatorBalance()

          // Atualiza o selectedCard com as informações de saldo recebidas
          setSelectedCard((prevCard) => {
            if (prevCard) {
              const updatedCard = {
                ...prevCard,
                cpf: balanceResponse.ownerCpf ?? prevCard.cpf,
                limitAvailable: balanceResponse.limitAvailable,
                totalLimit: balanceResponse.totalLimit,
              }

              return updatedCard
            }

            return prevCard
          })

          console.log('Saldo após autenticação:', balanceResponse)
        } catch (balanceError) {
          console.error(
            '❌ Erro ao carregar saldo após autenticação:',
            balanceError
          )
          // Não falha a autenticação se o saldo der erro
        }

        return true
      } else {
        console.error('❌ Token não recebido na resposta')
      }

      return false
    } catch (error) {
      console.error('❌ Erro na autenticação:', error)
      return false
    } finally {
      setIsCardLoading(false)
    }
  }

  const logoutCard = () => {
    setSelectedCard(null)
    setIsCardAuthenticated(false)
    setCardToken(null)
  }

  const getUserCards = async (): Promise<ResponseGetAllCardsUser> => {
    console.log('📋 getUserCards called - current selectedCard balance:', {
      limitAvailable: selectedCard?.limitAvailable,
      totalLimit: selectedCard?.totalLimit,
    })

    try {
      const response = await cardsServices.getCards()

      if (response && Array.isArray(response)) {
        const formattedCards = response.map((card: any) => ({
          id: card.id,
          cpf: '',
          cardNumber: card.cardNumber,
          cardholderName: card.name,
          cardPassword: '',
          totalLimit: 0,
          type: 'credit' as const,
          isActive: card.status ? card.status === 'ACTIVE' : true,
          closingDate: 0,
          limitAvailable: 0,
          dueDate: 0,
          period: '',
          creditReturnDate: 0,
          estimatedBilling: 0,
          bills: [],
        }))

        setCards(formattedCards)

        // Se há um cartão selecionado, atualiza seu status preservando os valores de saldo
        if (selectedCard) {
          const updatedSelectedCard = formattedCards.find(
            (c) => c.id === selectedCard.id
          )
          if (updatedSelectedCard) {
            // Preserva os valores de saldo do selectedCard atual (apenas se não forem zero)
            const preservedCard = {
              ...updatedSelectedCard,
              limitAvailable:
                selectedCard.limitAvailable > 0
                  ? selectedCard.limitAvailable
                  : updatedSelectedCard.limitAvailable,
              totalLimit:
                selectedCard.totalLimit > 0
                  ? selectedCard.totalLimit
                  : updatedSelectedCard.totalLimit,
              cpf: selectedCard.cpf || updatedSelectedCard.cpf,
            }

            setSelectedCard(preservedCard)
            setIsCurrentCardBlocked(!updatedSelectedCard.isActive)
          }
        }
      }

      return response
    } catch (error) {
      console.error('🃏 getUserCards: Erro ao buscar cartões:', error)
      throw error
    }
  }

  const checkCardBlockStatus = async (): Promise<ResponseGetAllCardsUser> => {
    try {
      return await getUserCards()
    } catch (error) {
      console.error('❌ Erro ao verificar status do cartão:', error)
      throw error
    }
  }

  const getPortatorBalance = async (): Promise<ResponseGetPortatorBalance> => {
    try {
      const response = await cardsServices.getPortatorBalance()

      // Atualiza o selectedCard com as informações de saldo recebidas
      setSelectedCard((prevCard) => {
        if (prevCard) {
          const updatedCard = {
            ...prevCard,
            cpf: response.ownerCpf ?? prevCard.cpf,
            limitAvailable: response.limitAvailable,
            totalLimit: response.totalLimit,
          }
          return updatedCard
        }
        console.log(
          '❌ getPortatorBalance: prevCard is null, cannot update balance'
        )
        return prevCard
      })

      return response
    } catch (error) {
      console.error('Erro ao buscar saldo do portador:', error)
      throw error
    }
  }

  const getPortatorBalanceBySearch = async (searchParams: {
    cpf?: string
    cardNumber?: string
  }): Promise<ResponseGetPortatorBalance> => {
    try {
      const response = await cardsServices.getPortatorBalanceBySearch(
        searchParams
      )
      console.log('🔍 getPortadorBalanceBySearch response:', response)
      return response
    } catch (error) {
      console.error('Erro ao buscar saldo por pesquisa:', error)
      throw error
    }
  }

  const getCardBillings = async (): Promise<ResponseGetBillingsCards> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      const response = await cardsServices.getBillingsCards()

      const formattedBills: Bill[] = response.map((billing) => {
        const [monthName, year] = billing.monthAndYear.split('/')

        const formatDate = (date: any) => {
          if (!date) return new Date().toISOString().split('T')[0]
          const dateObj = typeof date === 'string' ? new Date(date) : date
          return dateObj instanceof Date && !isNaN(dateObj.getTime())
            ? dateObj.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        }

        return {
          id: billing.id,
          month: monthName,
          year: parseInt(year),
          amount: billing.totalAmount,
          dueDate: formatDate(billing.dateEndBilling),
          closingDate: formatDate(billing.dateStartBilling),
          status: billing.status as BillStatus,
          cardId: selectedCard?.id || '',
          transactions: [],
        }
      })

      setSelectedCard((prevCard) => {
        if (prevCard) {
          return {
            ...prevCard,
            bills: formattedBills,
          }
        }
        return prevCard
      })

      return response
    } catch (error) {
      throw error
    }
  }

  const getBillingDetails = async (
    billingId: string
  ): Promise<ResponseGetBillingDetails> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      return await cardsServices.getBillingsDetailsCard(billingId)
    } catch (error) {
      throw error
    }
  }

  const changeCardPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      await cardsServices.changePasswordCard({
        password: currentPassword,
        newPassword,
        confirmPassword: newPassword,
      })
      return true
    } catch (error) {
      console.error('❌ Erro ao alterar senha do cartão:', error)
      return false
    }
  }

  const blockCard = async (): Promise<boolean> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      await cardsServices.blockCard()
      setIsCurrentCardBlocked(true)
      return true
    } catch (error) {
      console.error('❌ Erro ao bloquear cartão:', error)
      return false
    }
  }

  const unblockCard = async (): Promise<boolean> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      await cardsServices.unblockCard()
      setIsCurrentCardBlocked(false)
      return true
    } catch (error) {
      console.error('❌ Erro ao desbloquear cartão:', error)
      return false
    }
  }

  return (
    <CardContext.Provider
      value={{
        cards,
        selectedCard,
        isCardAuthenticated,
        isCardLoading,
        isCurrentCardBlocked,
        selectCard,
        authenticateCard,
        logoutCard,
        getUserCards,
        checkCardBlockStatus,
        getCardBillings,
        getBillingDetails,
        getPortatorBalance,
        getPortatorBalanceBySearch,
        changeCardPassword,
        blockCard,
        unblockCard,
      }}
    >
      {children}
    </CardContext.Provider>
  )
}

export function useCard() {
  const context = useContext(CardContext)

  if (!context) {
    throw new Error('useCard deve ser usado dentro de um CardProvider')
  }

  return context
}

import { createContext, ReactNode, useContext, useState } from 'react'
import { BillStatus } from 'src/components/cash-amount'
import { cardsServices } from 'src/services/cards/endpoints'
import {
  ResponseAuthCard,
  ResponseGetAllCardsUser,
  ResponseGetBalanceCard,
  ResponseGetBillingDetails,
  ResponseGetBillingsCards,
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
  balance: number
  creditLimit: number
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
  selectCard: (card: CreditCard) => void
  authenticateCard: (cardId: string, password: string) => Promise<boolean>
  logoutCard: () => void
  getUserCards: () => Promise<ResponseGetAllCardsUser>
  getCardBalance: () => Promise<ResponseGetBalanceCard>
  getCardBillings: () => Promise<ResponseGetBillingsCards>
  getBillingDetails: (billingId: string) => Promise<ResponseGetBillingDetails>
}

const CardContext = createContext<CardContextProps | null>(null)

export function CardProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)

  const [isCardAuthenticated, setIsCardAuthenticated] = useState(false)
  const [isCardLoading, setIsCardLoading] = useState(false)
  const [cardToken, setCardToken] = useState<string | null>(null)

  const selectCard = (card: CreditCard) => {
    // Se for um cartão diferente do atual, reset a autenticação
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
        console.log(selectedCard)

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
    try {
      const response = await cardsServices.getCards()

      // ResponseGetAllCardsUser é um array direto de cartões
      if (response && Array.isArray(response)) {
        const formattedCards = response.map((card) => ({
          id: card.id,
          cpf: '',
          cardNumber: card.cardNumber,
          cardholderName: card.name,
          cardPassword: '', // Não deve ser armazenado
          balance: 0, // Será obtido após autenticação
          creditLimit: 0, // Será obtido após autenticação
          type: 'credit' as const,
          isActive: true,
          closingDate: 0,
          dueDate: 0,
          period: '',
          creditReturnDate: 0,
          estimatedBilling: 0,
          bills: [],
        }))

        setCards(formattedCards)
      }

      return response
    } catch (error) {
      console.error('🃏 getUserCards: Erro ao buscar cartões:', error)
      throw error
    }
  }

  // Funções que requerem autenticação de cartão
  const getCardBalance = async (): Promise<ResponseGetBalanceCard> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      const response = await cardsServices.getBalanceCard()

      // Atualizar o cartão selecionado com os dados reais
      setSelectedCard((prevCard) => {
        if (prevCard) {
          return {
            ...prevCard,
            cpf: response.cpf,
            balance: response.limitAvailable,
            creditLimit: response.limitAvailable,
          }
        }
        return prevCard
      })

      return response
    } catch (error) {
      throw error
    }
  }

  const getCardBillings = async (): Promise<ResponseGetBillingsCards> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      const response = await cardsServices.getBillingsCards()

      // Mapear as bills do backend para o formato interno
      const formattedBills: Bill[] = response.map((billing) => {
        const [monthName, year] = billing.monthAndYear.split('/')

        // Converter datas de forma segura
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
          transactions: [], // Será preenchido ao buscar detalhes da fatura
        }
      })

      // console.log(formattedBills)

      // Atualizar o cartão selecionado com as bills
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

  return (
    <CardContext.Provider
      value={{
        cards,
        selectedCard,
        isCardAuthenticated,
        isCardLoading,
        selectCard,
        authenticateCard,
        logoutCard,
        getUserCards,
        getCardBalance,
        getCardBillings,
        getBillingDetails,
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

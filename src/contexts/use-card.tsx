import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
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
  const [isCardAuthenticated, setIsCardAuthenticated] = useState(false) // SEMPRE inicia FALSE
  const [isCardLoading, setIsCardLoading] = useState(false)
  const [cardToken, setCardToken] = useState<string | null>(null)

  // Debug useEffect para monitorar mudanças de estado - reduzido
  useEffect(() => {
    console.log('🔄 CardProvider:', {
      selectedCard: selectedCard ? selectedCard.cardholderName : 'nenhum',
      isCardAuthenticated,
      hasToken: !!cardToken,
    })
  }, [selectedCard, isCardAuthenticated, cardToken])

  const selectCard = (card: CreditCard) => {
    console.log(
      '📌 selectCard chamado com:',
      card.cardholderName,
      'ID:',
      card.id
    )
    setSelectedCard(card)
    setIsCardAuthenticated(false)
    setCardToken(null)
    console.log('📌 selectedCard definido')
  }

  const authenticateCard = async (
    cardId: string,
    password: string
  ): Promise<boolean> => {
    setIsCardLoading(true)

    console.log('🔐 INIT authenticateCard')
    console.log('🔐 cardId:', cardId)
    console.log('🔐 cards disponíveis:', cards.length)
    console.log(
      '🔐 cards array:',
      cards.map((c) => ({ id: c.id, name: c.cardholderName }))
    )

    try {
      const authData: AuthCardDTO = {
        cardId,
        password,
      }

      const response: ResponseAuthCard = await cardsServices.authCard(authData)

      if (response.token) {
        setCardToken(response.token)
        setCardAuthToken(response.token)

        // Primeiro, tenta usar o selectedCard atual se o ID bater
        if (selectedCard && String(selectedCard.id) === String(cardId)) {
          console.log(
            '✅ Usando selectedCard existente:',
            selectedCard.cardholderName
          )
          setIsCardAuthenticated(true)
          console.log(
            '✅ Autenticação concluída com sucesso - cartão já selecionado'
          )
          return true
        }

        // Se não tiver selectedCard ou ID diferente, busca no array de cartões
        console.log(
          '🔍 Procurando cartão com ID:',
          cardId,
          'no array de',
          cards.length,
          'cartões'
        )
        const cardToSelect = cards.find((card) => {
          return String(card.id) === String(cardId)
        })

        if (cardToSelect) {
          setSelectedCard(cardToSelect)
          console.log(
            '✅ Cartão encontrado e selecionado:',
            cardToSelect.cardholderName
          )
        } else {
          // Se ainda não encontrou, cria um cartão temporário com as informações que temos
          console.log(
            '⚠️ Cartão não encontrado no array, criando registro temporário'
          )
          const tempCard: CreditCard = {
            id: cardId,
            cardNumber: '****',
            cardholderName: 'Cartão Autenticado',
            balance: 0,
            creditLimit: 0,
            type: 'credit',
            isActive: true,
            closingDate: 0,
            dueDate: 0,
            period: '',
            creditReturnDate: 0,
            estimatedBilling: 0,
            bills: [],
          }
          setSelectedCard(tempCard)
          console.log('✅ Cartão temporário criado e selecionado')
        }

        setIsCardAuthenticated(true)
        console.log('✅ Autenticação concluída com sucesso')
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
        // Converter para o formato interno CreditCard se necessário
        const formattedCards = response.map((card) => ({
          id: card.id,
          cardNumber: card.cardNumber,
          cardholderName: card.name,
          cardPassword: '', // Não deve ser armazenado
          balance: 0, // Obtido separadamente
          creditLimit: 0, // Obtido separadamente
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
      return await cardsServices.getBalanceCard()
    } catch (error) {
      throw error
    }
  }

  const getCardBillings = async (): Promise<ResponseGetBillingsCards> => {
    if (!isCardAuthenticated || !cardToken) {
      throw new Error('Cartão não autenticado')
    }

    try {
      return await cardsServices.getBillingsCards()
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

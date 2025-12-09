import { createContext, ReactNode, useContext, useState } from 'react'

export interface CreditCard {
  id: string
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cardPassword: string
  balance: number
  creditLimit: number
  brand: 'mastercard' | 'visa' | 'elo'
  type: 'credit' | 'debit'
  isActive: boolean
  userId: string
  closingDate: number // dia do fechamento (1-31)
  dueDate: number // dia de vencimento (1-31)
  period: string // competência (ex: "Dez/2024")
  creditReturnDate: number // dia do retorno de crédito (1-31)
  estimatedBilling: number // faturamento previsto
}

interface CardContextProps {
  cards: CreditCard[]
  selectedCard: CreditCard | null
  isCardAuthenticated: boolean
  isCardLoading: boolean
  selectCard: (card: CreditCard) => void
  authenticateCard: (cardId: string, password: string) => Promise<boolean>
  logoutCard: () => void
  getUserCards: (userId: string) => CreditCard[]
}

const CardContext = createContext<CardContextProps | null>(null)

// Mock data dos cartões
const mockCards: CreditCard[] = [
  {
    id: '1',
    cardNumber: '4532 1234 5678 9012',
    cardholderName: 'JOAO CLIENTE',
    expiryDate: '12/28',
    cardPassword: '123456',
    balance: 2500.0,
    creditLimit: 5000.0,
    brand: 'visa',
    type: 'credit',
    isActive: true,
    userId: '1',
    closingDate: 15,
    dueDate: 10,
    period: 'Dez/2024',
    creditReturnDate: 25,
    estimatedBilling: 1250.0,
  },
  {
    id: '2',
    cardNumber: '5432 9876 5432 1098',
    cardholderName: 'JOAO CLIENTE',
    expiryDate: '08/27',
    cardPassword: '654321',
    balance: 1200.3,
    creditLimit: 3000.0,
    brand: 'mastercard',
    type: 'credit',
    isActive: true,
    userId: '1',
    closingDate: 20,
    dueDate: 15,
    period: 'Dez/2024',
    creditReturnDate: 30,
    estimatedBilling: 980.5,
  },
  {
    id: '3',
    cardNumber: '6362 1122 3344 5566',
    cardholderName: 'JOAO CLIENTE',
    expiryDate: '03/29',
    cardPassword: '111222',
    balance: 850.0,
    creditLimit: 2000.0,
    brand: 'elo',
    type: 'debit',
    isActive: true,
    userId: '1',
    closingDate: 25,
    dueDate: 20,
    period: 'Dez/2024',
    creditReturnDate: 5,
    estimatedBilling: 560.75,
  },
]

export function CardProvider({ children }: { children: ReactNode }) {
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)
  const [isCardAuthenticated, setIsCardAuthenticated] = useState(false)
  const [isCardLoading, setIsCardLoading] = useState(false)

  const selectCard = (card: CreditCard) => {
    setSelectedCard(card)
    setIsCardAuthenticated(false)
  }

  const authenticateCard = async (
    cardId: string,
    password: string
  ): Promise<boolean> => {
    setIsCardLoading(true)

    try {
      // Simula delay de autenticação
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const card = mockCards.find((c) => c.id === cardId)

      if (card && card.cardPassword === password) {
        setSelectedCard(card)
        setIsCardAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error('Erro na autenticação do cartão:', error)
      return false
    } finally {
      setIsCardLoading(false)
    }
  }

  const logoutCard = () => {
    setSelectedCard(null)
    setIsCardAuthenticated(false)
  }

  const getUserCards = (userId: string): CreditCard[] => {
    return mockCards.filter((card) => card.userId === userId)
  }

  return (
    <CardContext.Provider
      value={{
        cards: mockCards,
        selectedCard,
        isCardAuthenticated,
        isCardLoading,
        selectCard,
        authenticateCard,
        logoutCard,
        getUserCards,
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

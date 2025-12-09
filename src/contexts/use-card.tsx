import { createContext, ReactNode, useContext, useState } from 'react'

export interface Bill {
  id: string
  month: string
  year: number
  amount: number
  dueDate: string
  closingDate: string
  status: 'pending' | 'paid' | 'overdue'
  cardId: string
}

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
  // Novas informações para os BillInfoCards
  closingDate: number // dia do fechamento (1-31)
  dueDate: number // dia de vencimento (1-31)
  period: string // competência (ex: "Dez/2024")
  creditReturnDate: number // dia do retorno de crédito (1-31)
  estimatedBilling: number // faturamento previsto
  bills: Bill[] // histórico de faturas
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
  getBills: (cardId: string) => Bill[]
}

const CardContext = createContext<CardContextProps | null>(null)

// Mock data das faturas
const mockBills: Bill[] = [
  {
    id: '1',
    month: 'dezembro',
    year: 2024,
    amount: 1250.0,
    dueDate: '10/01/2025',
    closingDate: '15/12/2024',
    status: 'pending',
    cardId: '1',
  },
  {
    id: '2',
    month: 'novembro',
    year: 2024,
    amount: 890.5,
    dueDate: '10/12/2024',
    closingDate: '15/11/2024',
    status: 'paid',
    cardId: '1',
  },
  {
    id: '3',
    month: 'outubro',
    year: 2024,
    amount: 2150.75,
    dueDate: '10/11/2024',
    closingDate: '15/10/2024',
    status: 'paid',
    cardId: '1',
  },
  {
    id: '4',
    month: 'setembro',
    year: 2024,
    amount: 756.3,
    dueDate: '10/10/2024',
    closingDate: '15/09/2024',
    status: 'overdue',
    cardId: '1',
  },
  {
    id: '5',
    month: 'dezembro',
    year: 2024,
    amount: 980.5,
    dueDate: '15/01/2025',
    closingDate: '20/12/2024',
    status: 'pending',
    cardId: '2',
  },
  {
    id: '6',
    month: 'novembro',
    year: 2024,
    amount: 1180.25,
    dueDate: '15/12/2024',
    closingDate: '20/11/2024',
    status: 'paid',
    cardId: '2',
  },
]

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
    bills: mockBills.filter((bill) => bill.cardId === '1'),
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
    bills: mockBills.filter((bill) => bill.cardId === '2'),
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
    bills: [],
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

  const getBills = (cardId: string): Bill[] => {
    return mockBills.filter((bill) => bill.cardId === cardId)
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
        getBills,
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

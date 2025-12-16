import { createContext, ReactNode, useContext, useState } from 'react'
import { BillStatus } from 'src/components/cash-amount'

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
  getTransactions: (billId: string) => Transaction[]
}

const CardContext = createContext<CardContextProps | null>(null)

// Mock data das faturas
const mockBills: Bill[] = [
  {
    id: '1',
    month: 'dezembro',
    year: 2024,
    amount: 1250.0,
    dueDate: '2025-01-10',
    closingDate: '2024-12-12',
    status: 'current',
    cardId: '1',
    transactions: [
      {
        id: '1',
        title: 'Supermercado ABC',
        amount: 125.5,
        date: '2024-12-05',
        type: 'transfer',
      },
      {
        id: '2',
        title: 'Farmácia Central',
        amount: 67.8,
        date: '2024-12-05',
        type: 'transfer',
      },
      {
        id: '3',
        title: 'Posto de Gasolina',
        amount: 189.9,
        date: '2024-12-07',
        type: 'transfer',
      },
      {
        id: '4',
        title: 'Cashback XYZ',
        amount: 45.2,
        date: '2024-12-07',
        type: 'payment',
      },
      {
        id: '5',
        title: 'Restaurante Italiano',
        amount: 156.3,
        date: '2024-12-08',
        type: 'transfer',
      },
      {
        id: '6',
        title: 'Streaming Service',
        amount: 29.9,
        date: '2024-12-09',
        type: 'transfer',
      },
    ],
  },
  {
    id: '2',
    month: 'novembro',
    year: 2024,
    amount: 890.5,
    dueDate: '2024-12-10',
    closingDate: '2024-11-12',
    status: 'paid',
    cardId: '1',
    transactions: [
      {
        id: '7',
        title: 'Shopping Center',
        amount: 245.8,
        date: '2024-11-03',
        type: 'transfer',
      },
      {
        id: '8',
        title: 'Padaria do Bairro',
        amount: 18.5,
        date: '2024-11-05',
        type: 'transfer',
      },
      {
        id: '9',
        title: 'Netflix',
        amount: 32.9,
        date: '2024-11-08',
        type: 'transfer',
      },
      {
        id: '10',
        title: 'Mercado Livre',
        amount: 156.2,
        date: '2024-11-10',
        type: 'transfer',
      },
    ],
  },
  {
    id: '3',
    month: 'outubro',
    year: 2024,
    amount: 2150.75,
    dueDate: '2024-11-10',
    closingDate: '2024-10-12',
    status: 'paid',
    cardId: '1',
    transactions: [
      {
        id: '11',
        title: 'Supermercado Central',
        amount: 320.5,
        date: '2024-10-02',
        type: 'transfer',
      },
      {
        id: '12',
        title: 'Posto Shell',
        amount: 180.0,
        date: '2024-10-05',
        type: 'transfer',
      },
      {
        id: '13',
        title: 'Restaurante Japonês',
        amount: 95.8,
        date: '2024-10-08',
        type: 'transfer',
      },
    ],
  },
  {
    id: '4',
    month: 'setembro',
    year: 2024,
    amount: 756.3,
    dueDate: '2024-10-10',
    closingDate: '2024-09-15',
    status: 'overdue',
    cardId: '1',
    transactions: [
      {
        id: '14',
        title: 'Farmácia São Paulo',
        amount: 67.5,
        date: '2024-09-03',
        type: 'transfer',
      },
      {
        id: '15',
        title: 'Uber Eats',
        amount: 42.8,
        date: '2024-09-07',
        type: 'transfer',
      },
      {
        id: '16',
        title: 'Amazon',
        amount: 156.0,
        date: '2024-09-12',
        type: 'transfer',
      },
    ],
  },
  {
    id: '5',
    month: 'dezembro',
    year: 2024,
    amount: 980.5,
    dueDate: '15/01/2025',
    closingDate: '20/12/2024',
    status: 'current',
    cardId: '2',
    transactions: [
      {
        id: '17',
        title: 'Livraria Cultura',
        amount: 89.9,
        date: '2024-12-03',
        type: 'transfer',
      },
      {
        id: '18',
        title: 'Cinema Multiplex',
        amount: 48.0,
        date: '2024-12-06',
        type: 'transfer',
      },
      {
        id: '19',
        title: 'Spotify',
        amount: 21.9,
        date: '2024-12-10',
        type: 'transfer',
      },
    ],
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
    transactions: [
      {
        id: '20',
        title: 'Mercado Extra',
        amount: 234.6,
        date: '2024-11-04',
        type: 'transfer',
      },
      {
        id: '21',
        title: 'Posto Petrobras',
        amount: 145.8,
        date: '2024-11-08',
        type: 'transfer',
      },
      {
        id: '22',
        title: 'Cashback Programa',
        amount: 25.5,
        date: '2024-11-15',
        type: 'payment',
      },
    ],
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

  const getTransactions = (billId: string): Transaction[] => {
    const bill = mockBills.find((bill) => bill.id === billId)
    return bill?.transactions || []
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
        getTransactions,
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

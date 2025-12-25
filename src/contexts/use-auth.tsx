import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type UserType = 'client' | 'supplier'

interface User {
  id: string
  phone: string
  cpf: string
  city: string
  state: string
  userType: UserType
  name?: string
}

interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (cpf: string, password: string, userType: UserType) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | null>(null)

const mockUsers = [
  {
    id: '1',
    cpf: '12345678900',
    phone: '(11) 91234-5678',
    password: '123456',
    city: 'Fortaleza',
    state: 'Ceará, CE',
    userType: 'client' as UserType,
    name: 'João Portador',
  },
  {
    id: '2',
    cpf: '98765432100',
    phone: '(21) 99876-5432',
    city: 'Fortaleza',
    password: '123456',
    state: 'Ceará, CE',
    userType: 'supplier' as UserType,
    name: 'Maria Lojista',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkStoredSession = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const storedUser = null

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkStoredSession()
  }, [])

  const login = async (
    cpf: string,
    password: string,
    userType: UserType
  ): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const foundUser = mockUsers.find(
        (u) =>
          u.cpf === cpf && u.password === password && u.userType === userType
      )

      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          cpf: foundUser.cpf,
          state: foundUser.state,
          phone: foundUser.phone,
          userType: foundUser.userType,
          city: foundUser.city,
          name: foundUser.name,
        }

        setUser(userData)

        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUser(null)
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}

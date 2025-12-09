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
  email: string
  userType: UserType
  name?: string
}

interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (
    email: string,
    password: string,
    userType: UserType
  ) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | null>(null)

const mockUsers = [
  {
    id: '1',
    email: 'cliente@teste.com',
    password: '123456',
    userType: 'client' as UserType,
    name: 'João Cliente',
  },
  {
    id: '2',
    email: 'fornecedor@teste.com',
    password: '123456',
    userType: 'supplier' as UserType,
    name: 'Maria Fornecedora',
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
    email: string,
    password: string,
    userType: UserType
  ): Promise<boolean> => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const foundUser = mockUsers.find(
        (u) =>
          u.email === email &&
          u.password === password &&
          u.userType === userType
      )

      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          userType: foundUser.userType,
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

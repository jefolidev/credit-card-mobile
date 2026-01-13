import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { authServices } from 'src/services/auth/auth.services'
import { UserRole } from 'src/services/auth/enum/user-role'
import { GetMeResponse } from 'src/services/auth/responses.dto'
import { clearAuthToken, setAuthToken } from '../api/api'

interface AuthContextProps {
  user: GetMeResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  auth: (
    document: string,
    password: string,
    userType: UserRole
  ) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextProps | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GetMeResponse | null>(null)
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

  const auth = async (
    document: string,
    password: string,
    userType: UserRole
  ): Promise<boolean> => {
    setIsLoading(true)
    const { login, cnpjLogin, getMe } = authServices

    try {
      // Faz login e captura o token
      const loginResponse =
        userType === 'PORTATOR'
          ? await login({ cpf: document, password })
          : await cnpjLogin({ cnpj: document, password })

      if (loginResponse.token) {
        setAuthToken(loginResponse.token)
      }

      // Após autenticação bem-sucedida, busca os dados do usuário
      const { id, email, name, role, cpf, telefoneCelular } = await getMe()
      if (email && name && role) {
        const userData = {
          id,
          userType,
          name,
          role,
          email,
          cpf,
          telefoneCelular,
        }

        setUser(userData)

        return true
      } else {
        return false
      }
    } catch (error: any) {
      console.error('Erro no login:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)

    try {
      clearAuthToken()

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
        auth,
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

# Sistema de Autenticação - Credit Card App

## 📝 Visão Geral

Este sistema de autenticação foi implementado para funcionar sem backend, usando dados simulados para desenvolvimento. O sistema suporta dois tipos de usuários: **Cliente** e **Fornecedor**.

## 🔐 Credenciais de Teste

### Cliente

- **Email:** `cliente@teste.com`
- **Senha:** `123456`
- **Tipo:** Cliente

### Fornecedor

- **Email:** `fornecedor@teste.com`
- **Senha:** `123456`
- **Tipo:** Fornecedor

## 🚀 Funcionalidades Implementadas

### ✅ Contexto de Autenticação (`useAuth`)

- **Login/Logout** com validação de credenciais
- **Estado de carregamento** durante operações
- **Persistência de sessão** (preparado para AsyncStorage)
- **Verificação de autenticação** automática
- **Tipos de usuário** diferenciados

### ✅ Navegação Condicional

- **Tela de login** quando não autenticado
- **Tela principal** quando autenticado
- **Loading screen** durante verificação de sessão

### ✅ Interface de Login

- **Validação de campos** obrigatórios
- **Seleção de tipo de usuário** (Cliente/Fornecedor)
- **Feedback visual** durante login
- **Mensagens de erro** informativas

### ✅ Interface Principal

- **Saudação personalizada** com nome do usuário
- **Informação do tipo** de usuário
- **Botão de logout** com confirmação
- **Navegação integrada**

## 🛠️ Estrutura do Código

### Contexto de Autenticação

```typescript
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
```

### Tipo de Usuário

```typescript
interface User {
  id: string
  email: string
  userType: 'client' | 'supplier'
  name?: string
}
```

## 🔄 Fluxo de Autenticação

1. **Inicialização**: Verifica se existe sessão salva
2. **Login**: Valida credenciais e cria sessão
3. **Navegação**: Redireciona baseado no estado de autenticação
4. **Logout**: Remove sessão e retorna para login

## 📱 Como Usar

1. **Abra o app** - será direcionado para a tela de login
2. **Selecione o tipo** de usuário (Cliente ou Fornecedor)
3. **Digite as credenciais** de teste
4. **Clique em "Entrar"** - aguarde o carregamento
5. **Use o app** normalmente
6. **Para sair**: clique no ícone de logout na navegação inferior

## 🔧 Configuração para Produção

Para usar em produção, você precisará:

### 1. Integrar com AsyncStorage

```typescript
// Descomentar as linhas relacionadas ao AsyncStorage no contexto
import AsyncStorage from '@react-native-async-storage/async-storage'
```

### 2. Conectar com API real

```typescript
// Substituir as funções mockadas por chamadas reais da API
const login = async (email, password, userType) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, userType }),
  })

  return response.json()
}
```

### 3. Implementar refresh token

```typescript
// Adicionar lógica de refresh token para manter sessões longas
```

## 🎯 Próximos Passos

- [ ] Integração com AsyncStorage
- [ ] Conexão com API backend
- [ ] Implementação de refresh token
- [ ] Recuperação de senha
- [ ] Registro de novos usuários
- [ ] Validação de email
- [ ] Autenticação biométrica (opcional)

## 🐛 Solução de Problemas

### Erro: "useAuth deve ser usado dentro de um AuthProvider"

- Certifique-se que o `AuthProvider` está envolvendo toda a aplicação

### Login não funciona

- Verifique se está usando as credenciais corretas
- Confirme se o tipo de usuário está selecionado corretamente

### Navegação não muda após login

- Verifique se o `StackRoutes` está recebendo o parâmetro `isAuthenticated`

## 📞 Suporte

Se encontrar algum problema, verifique:

1. Console de erros do React Native
2. Se todos os contextos estão configurados
3. Se as dependências estão instaladas
4. Se as rotas estão configuradas corretamente

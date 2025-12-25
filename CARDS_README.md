# Sistema de Autenticação + Cartões - Credit Card App

## 📝 Visão Geral

Sistema completo de autenticação com suporte a cartões de crédito/débito para clientes. O sistema funciona sem backend, usando dados simulados para desenvolvimento, e inclui navegação condicional baseada no tipo de usuário e autenticação de cartões.

## 🔐 Credenciais de Teste

### Usuários

**Cliente:**

- **Email:** `cliente@teste.com`
- **Senha:** `123456`
- **Tipo:** Cliente (acesso a cartões)

**Lojista:**

- **Email:** `lojista@teste.com`
- **Senha:** `123456`
- **Tipo:** Fornecedor (sem cartões)

### Cartões (apenas para clientes)

**Cartão 1 - Visa Crédito:**

- **Número:** 4532 1234 5678 9012
- **Senha:** `123456`
- **Saldo:** R$ 2.500,75
- **Limite:** R$ 5.000,00

**Cartão 2 - Mastercard Crédito:**

- **Número:** 5432 9876 5432 1098
- **Senha:** `654321`
- **Saldo:** R$ 1.200,30
- **Limite:** R$ 3.000,00

**Cartão 3 - Elo Débito:**

- **Número:** 6362 1122 3344 5566
- **Senha:** `111222`
- **Saldo:** R$ 850,00
- **Limite:** R$ 2.000,00

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Autenticação

- **Login/Logout** com validação de credenciais
- **Tipos de usuário** diferenciados (Portador/Lojista)
- **Navegação condicional** baseada no tipo de usuário

### ✅ Sistema de Cartões (Clientes)

- **Seleção de cartões** disponíveis para o usuário
- **Autenticação por cartão** com senha de 6 dígitos
- **Dados mockados** com informações reais (número, portador, validade, saldo, limite)
- **Navegação bottom tabs** após autenticação do cartão

### ✅ Navegação Inteligente

- **Lojistas:** Login → Bottom Tabs direto
- **Clientes:** Login → Seleção Cartão → Autenticação Cartão → Bottom Tabs
- **Estados de loading** e validações em cada etapa

### ✅ Bottom Tab Navigation

- **Resumo:** Informações do cartão e resumo da conta
- **Extrato:** Histórico de transações (mockado)
- **Cartões:** Gerenciamento e seleção de cartões
- **Perfil:** Informações do usuário e cartão ativo

## 🎯 Fluxo de Navegação

### Para Lojistas:

1. **Login** → Bottom Tabs (acesso completo)

### Para Clientes:

1. **Login** → Tela de Seleção de Cartões
2. **Seleção de Cartão** → Tela de Autenticação do Cartão
3. **Autenticação (6 dígitos)** → Bottom Tabs com dados do cartão

## 🛠️ Estrutura dos Contextos

### AuthContext

```typescript
interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (cpf: string, password: string, userType: UserType) => Promise<boolean>
  logout: () => void
}
```

### CardContext

```typescript
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
```

### CreditCard Interface

```typescript
interface CreditCard {
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
}
```

## 📱 Como Testar

### Como Lojista:

1. **Login** com credenciais de lojista
2. **Acesso direto** às tabs principais
3. **Não há** gestão de cartões

### Como Cliente:

1. **Login** com credenciais de cliente
2. **Selecione um cartão** na lista disponível
3. **Digite a senha** de 6 dígitos do cartão
4. **Navegue pelas tabs** com dados do cartão ativo
5. **Teste logout** para voltar à seleção de cartões

## 🎨 Interface Implementada

### ✅ Telas Criadas

- **Cards:** Lista e seleção de cartões (apenas clientes)
- **CardAuthentication:** Autenticação com senha de 6 dígitos
- **Home:** Resumo com informações do cartão ativo
- **Transactions:** Extrato de transações (mockado)
- **Profile:** Perfil do usuário e informações do cartão
- **Login:** Autenticação de usuário original

### ✅ Navegação

- **Stack Navigation:** Controle de fluxo condicional
- **Bottom Tab Navigation:** Após autenticação completa
- **Estados de loading:** Em todas as operações assíncronas

## 🔧 Próximos Passos

- [ ] Integração com AsyncStorage para persistência
- [ ] Conexão com APIs reais
- [ ] Biometria para autenticação de cartões
- [ ] Histórico de transações real
- [ ] Notificações push
- [ ] Gestão de múltiplos cartões por usuário
- [ ] Bloqueio/desbloqueio de cartões

## 🐛 Solução de Problemas

### "Apenas clientes podem acessar cartões"

- Certifique-se de fazer login como cliente

### Cartão não autentica

- Verifique se está usando a senha correta de 6 dígitos
- Confirme que o cartão está selecionado

### Navegação não muda

- Verifique se completou todas as etapas de autenticação
- Confirme se os contextos estão configurados corretamente

## 📊 Dados de Teste Completos

```javascript
// Usuário Cliente
email: 'cliente@teste.com'
senha: '123456'

// Cartões do Cliente
Visa: '4532 1234 5678 9012' → senha: '123456'
Master: '5432 9876 5432 1098' → senha: '654321'
Elo: '6362 1122 3344 5566' → senha: '111222'

// Usuário Lojista
email: 'lojista@teste.com'
senha: '123456'
// Sem cartões associados
```

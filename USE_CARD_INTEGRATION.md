# Use-Card Context - Integração Completa

## ✅ Implementações Realizadas

### 1. Sistema de Token de Cartão

- ✅ Funções `setCardAuthToken()` e `clearCardAuthToken()` no cliente API
- ✅ Header `authorization_card` automaticamente adicionado nas requisições
- ✅ Token salvo após autenticação bem-sucedida do cartão

### 2. Funções Implementadas

#### Autenticação

```typescript
const { authenticateCard } = useCard()

// Autentica o cartão e salva o token automaticamente
const success = await authenticateCard('cardId', 'password')
```

#### Buscar Cartões do Usuário

```typescript
const { getUserCards } = useCard()

// Retorna array de cartões do usuário logado
const cards = await getUserCards()
```

#### Operações com Cartão Autenticado

```typescript
const { getCardBalance, getCardBillings, getBillingDetails } = useCard()

// Requer cartão autenticado
const balance = await getCardBalance()
const billings = await getCardBillings()
const details = await getBillingDetails('billingId')
```

### 3. Estados Disponíveis

- `cards`: Array de cartões do usuário
- `selectedCard`: Cartão atualmente selecionado
- `isCardAuthenticated`: Se o cartão está autenticado
- `isCardLoading`: Estado de carregamento

### 4. Fluxo de Uso Completo

```typescript
function CartaoScreen() {
  const {
    getUserCards,
    selectCard,
    authenticateCard,
    getCardBalance,
    isCardAuthenticated,
    isCardLoading,
  } = useCard()

  useEffect(() => {
    // 1. Buscar cartões do usuário
    getUserCards()
  }, [])

  const handleSelectCard = (card) => {
    // 2. Selecionar cartão
    selectCard(card)
  }

  const handleAuthenticate = async (password) => {
    // 3. Autenticar cartão
    const success = await authenticateCard(selectedCard.id, password)

    if (success) {
      // 4. Cartão autenticado - pode usar funções protegidas
      const balance = await getCardBalance()
    }
  }
}
```

### 5. Sistema de Headers Automático

O cliente API agora adiciona automaticamente:

- `Authorization: Bearer <user_token>` - Token do usuário logado
- `authorization_card: Bearer <card_token>` - Token do cartão autenticado

### 6. Tratamento de Erros

Todas as funções que requerem autenticação de cartão verificam:

```typescript
if (!isCardAuthenticated || !cardToken) {
  throw new Error('Cartão não autenticado')
}
```

## 🔄 Próximas Integrações

1. **Telas de Cartão**: Integrar com as telas existentes
2. **QR Code**: Implementar pagamento via QR Code
3. **Persistência**: Salvar token de cartão em storage seguro
4. **Renovação**: Auto-renovação do token quando expira

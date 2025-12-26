# Backend API — Documentação (v0)

- Datas: ISO 8601 (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ssZ`)
- Moeda: valores em centavos (`amountCents: number`)
- IDs: `id: string` (UUID ou similar)
- CPF: `cpf: string` (apenas dígitos, 11 caracteres). O app mascara, mas envia limpo
- Cartão: `cardNumber: string` (16 dígitos, sem espaços), `expiry: string` (MM/YY) [TBD], `cvv: string` [TBD]
- Erros: `4xx/5xx` → `{ error: { code: string; message: string; details?: unknown } }`

## Autenticação

### POST /auth/login

- Body

```ts
{
  cpf: string // 11 dígitos, sem máscara
  password: string // 6 dígitos
}
```

- 200 Response

```ts
{
  token: string;
  user: {
    id: string;
    cpf: string;
    phone: string;
    city: string;
    state: string;
    userType: 'client' | 'supplier';
    name?: string;
  }
}
```

- Descrição: autentica usuário (portador/lojista) e retorna token + perfil

### POST /auth/logout

- Header: Authorization
- Body: —
- 204 Response
- Descrição: invalida o token atual

### GET /auth/me

- Header: Authorization
- 200 Response: mesmo shape de `user` acima
- Descrição: retorna os dados do usuário autenticado

## Cartões

### GET /users/{userId}/cards

- 200 Response

```ts
{
  cards: CreditCard[]
}

type CreditCard = {
  id: string;
  cardNumberMasked: string;     // exibição
  cardholderName: string;
  expiry: string;               // MM/YY
  type: 'credit' | 'debit';
  balanceCents: number;
  creditLimitCents: number;
  isActive: boolean;
  closingDay: number;           // 1-31
  dueDay: number;               // 1-31
  period: string;               // p.ex. "Dez/2024"
  creditReturnDay: number;      // 1-31
  estimatedBillingCents: number;
}
```

- Descrição: lista os cartões do usuário

### POST /cards/{cardId}/authenticate

- Body

```ts
{
  password: string
} // 6 dígitos
```

- 200 Response

```ts
{
  authenticated: boolean
}
```

- Descrição: valida senha do cartão

### GET /cards/{cardId}/balance

- 200 Response

```ts
{
  balanceCents: number
  creditLimitCents: number
  availableCents: number
  usedCents: number
}
```

- Descrição: retorna saldo e limites do cartão

### GET /cards/search

- Query: `cpf?: string` | `cardNumber?: string`
- 200 Response

```ts
CardSummary[]

type CardSummary = {
  id: string;
  cardNumberMasked: string;
  holderName: string;
  cpf: string;                        // pode vir mascarado para exibição
  cardType: string;
  status: 'active' | 'inactive';
  balance: {
    totalLimitCents: number;
    availableCents: number;
    usedCents: number;
    dueDay: number;                   // dia de vencimento
  };
}
```

- Descrição: busca por CPF ou número do cartão (consulta de saldo)

## Faturas

### GET /cards/{cardId}/bills

- Query: `status?: 'current'|'paid'|'overdue'`, `month?: number`, `year?: number`
- 200 Response

```ts
Bill[]

type Bill = {
  id: string;
  month: string;          // p.ex. "dezembro"
  year: number;           // 2024
  amountCents: number;
  dueDate: string;        // ISO
  closingDate: string;    // ISO
  status: 'current' | 'paid' | 'overdue';
}
```

- Descrição: lista faturas do cartão

### GET /bills/{billId}

- 200 Response

```ts
Bill & { transactions: Transaction[] }

type Transaction = {
  id: string;
  title: string;
  amountCents: number;
  date: string;                  // ISO
  type: 'transfer' | 'payment';
}
```

- Descrição: detalhes da fatura + transações do período

### POST /bills/{billId}/pay

- Body

```ts
{
  amountCents: number
} // [TBD] pagamento parcial permitido?
```

- 200 Response

```ts
{
  status: 'paid'
  paidAt: string
} // paidAt ISO
```

- Descrição: registra pagamento da fatura

## Vendas (Lojista)

### POST /sales/manual

- Body

```ts
{
  amountCents: number;
  installments: number;      // 1-12
  cardNumber: string;        // 16 dígitos (sem espaços)
  customerName: string;
  expiry?: string;           // MM/YY [TBD]
  cvv?: string;              // [TBD]
}
```

- 201 Response

```ts
{
  id: string;
  status: 'authorized' | 'unauthorized';
  authCode?: string;
  createdAt: string;          // ISO
}
```

- Descrição: autoriza venda digitada

### POST /sales/qr/init

- Body

```ts
{
  amountCents: number
  installments: number
}
```

- 201 Response

```ts
{
  saleId: string
  qrCodePayload: string
  expiresAt: string
}
```

- Descrição: inicia venda com QR Code e retorna payload

### GET /sales/{saleId}

- 200 Response

```ts
{
  id: string;
  status: 'pending' | 'authorized' | 'unauthorized' | 'cancelled';
  authCode?: string;
  updatedAt: string;           // ISO
}
```

- Descrição: status de uma venda (polling)

### GET /sales

- Query: `status?: 'authorized'|'unauthorized'|'cancelled'`, `q?: string`, `page?: number`, `pageSize?: number`
- 200 Response

```ts
{
  items: SaleHistoryItem[];
  total: number;
}

type SaleHistoryItem = {
  id: string;
  customerName: string;
  cardNumberMasked: string;
  amountCents: number;
  installments: number;
  createdAt: string;           // ISO
  status: 'authorized' | 'unauthorized' | 'cancelled';
}
```

- Descrição: lista vendas com filtros (histórico)

### POST /sales/{saleId}/cancel

- Body

```ts
{
  reason: 'customer_request' |
    'duplicate_transaction' |
    'incorrect_amount' |
    'incorrect_card' |
    'other'
}
```

- 200 Response

```ts
{
  status: 'cancelled'
  cancelledAt: string
  reason: string
}
```

- Descrição: cancela venda autorizada

## Transações

### GET /bills/{billId}/transactions

- 200 Response: `Transaction[]` (mesmo tipo da seção Faturas)
- Descrição: lista transações da fatura

### GET /cards/{cardId}/transactions

- Query: `from?: string` (ISO), `to?: string` (ISO), `type?: 'transfer'|'payment'`
- 200 Response: `Transaction[]`
- Descrição: extrato do cartão por período

## Lojista (Dashboard)

- Descrição: métricas do dashboard do lojista

## Perfil

### GET /profile

- Header: Authorization
- 200 Response

```ts
{
  id: string;
  name?: string;
  cpf: string;
  phone: string;
  city: string;
  state: string;
  userType: 'client' | 'supplier';
}
```

- Descrição: retorna perfil do usuário

### PATCH /profile

- Header: Authorization
- Body

```ts
{ phone?: string }
```

- 200 Response: mesmo shape do GET
- Descrição: atualiza dados do perfil (ex.: telefone)

## Clientes

### PATCH /profile/phone

- Header: Authorization
- Body

```ts
{
  phone: string
} // formato E.164 recomendado (e.g. "+5511912345678")
```

- 200 Response

```ts
{
  success: true
  phone: string
}
```

- Descrição: altera o número de celular do cliente autenticado.

### GET /me/overview

- Header: Authorization
- 200 Response

```ts
{
  user: {
    id: string;
    name?: string;
    cpf: string;
    phone: string;
    city: string;
    state: string;
    userType: 'client' | 'supplier';
  };
  cards: Array<{
    id: string;
    cardNumberMasked: string;
    cardholderName: string;
    expiry: string;               // MM/YY
    brand: 'visa' | 'mastercard' | 'elo';
    type: 'credit' | 'debit';
    balanceCents: number;
    creditLimitCents: number;
    isActive: boolean;
    closingDay: number;
    dueDay: number;
  }>;
}
```

- Descrição: obtém perfil e cartões em uma única chamada ("FetchProfileAndCards").

## Cartões — Ações do Portador

> Todas exigem `Authorization` e, quando indicado, a senha atual do cartão.

### POST /cards/{cardId}/password/change

- Body

```ts
{
  currentPassword: string // 6 dígitos
  newPassword: string // 6 dígitos
}
```

- 200 Response

```ts
{
  success: true
}
```

- Descrição: altera a senha (PIN) do cartão autenticado.

### POST /cards/{cardId}/block

- Body

```ts
{ reason?: 'lost' | 'stolen' | 'fraud' | 'customer_request' }
```

- 200 Response

```ts
{
  status: 'blocked'
  blockedAt: string
} // ISO
```

- Descrição: bloqueia o cartão atual.

### POST /cards/{cardId}/replacement

- Body

```ts
{
  delivery:
    {
        type: 'custom_address';
        address: {
          street: string;
          number: string;
          complement?: string;
          district: string;
          city: string;
          state: string;   // UF
          zip: string;     // CEP (apenas dígitos)
        };
}
```

- 201 Response

```ts
{ requestId: string; status: 'requested'; estimatedDelivery?: string } // ISO
```

- Descrição: solicita segunda via do cartão (reemissão).

## Observações & TBDs

- Venda manual: app atual não coleta `expiry`/`cvv`. Se o motor de autorização exigir, incluir.
- Datas no app são exibidas em pt-BR; backend envia ISO.
- Máscaras (CPF/cartão) são tratadas no front; backend recebe valores limpos.
- Para troca de PIN e bloqueio, considerar MFA/step-up (ex.: SMS/OTP) [TBD].
- `GET /me/overview` substitui múltiplas chamadas (`/auth/me` + `/users/{id}/cards`) quando conveniente.

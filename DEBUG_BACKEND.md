# Backend Local Test Server

Para testar as requisições, você precisa ter um backend rodando. Como parece que não há um backend ainda, aqui estão algumas opções:

## Opção 1: Backend Mock Simples (Recomendado para teste rápido)

Crie um arquivo `mock-server.js`:

```javascript
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Mock de login
app.post('/sessions/login-by-cpf', (req, res) => {
  console.log('Login request:', req.body)

  const { cpf, password } = req.body

  // Mock de validação
  if (cpf === '43501465718' && password === '123456') {
    res.json({
      token: 'mock-token-12345',
      user: {
        id: '1',
        name: 'Usuario Mock',
        role: 'PORTATOR',
      },
    })
  } else {
    res.status(401).json({
      message: 'Credenciais inválidas',
    })
  }
})

// Mock de get me
app.get('/sessions/me', (req, res) => {
  console.log('GetMe request')

  res.json({
    id: '1',
    name: 'Usuario Mock',
    email: 'mock@example.com',
    role: 'PORTATOR',
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Mock server rodando na porta ${PORT}`)
  console.log(`URL: http://localhost:${PORT}`)
})
```

Para instalar e rodar:

```bash
npm install express cors
node mock-server.js
```

## Opção 2: Configurar URL de Desenvolvimento

Se você já tem um backend em outro local, configure a variável de ambiente:

1. Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_BASE_URL=http://sua-api.com:porta
```

2. Ou configure direto no código para teste:

```typescript
// Em src/api/api.ts, altere temporariamente:
const baseURL = 'http://sua-url-backend:porta'
```

## Próximos Passos

1. **Para teste imediato**: Use o mock server acima
2. **Para desenvolvimento**: Configure um backend real com os endpoints documentados
3. **Para debug**: Os logs adicionados vão mostrar exatamente onde está falhando

## Debug do Erro de Rede

O erro "network error 43501465718" indica que:

- A requisição não conseguiu conectar com o backend
- Pode ser problema de URL, porta, ou o backend não estar rodando
- O número pode ser algum código interno do RN/Expo

Execute o app novamente e verifique os logs no console para mais detalhes.

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {

  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock de login
app.post('/sessions/login-by-cpf', (req, res) => {
  console.log('Login request recebido:', req.body);

  const { cpf, password } = req.body;

  // Mock de validação - aceita qualquer CPF com senhas teste
  if (password === '123456' || password === 'senha123') {
    res.json({
      token: 'mock-token-12345',
      user: {
        id: '1',
        name: 'Usuario Mock',
        role: 'PORTATOR'
      }
    });
  } else {
    res.status(401).json({
      message: 'Credenciais inválidas',
      code: 'INVALID_CREDENTIALS'
    });
  }
});

// Mock de get me
app.get('/sessions/me', (req, res) => {
  console.log('GetMe request recebido');

  res.json({
    id: '1',
    name: 'Usuario Mock',
    email: 'mock@example.com',
    role: 'PORTATOR'
  });
});

// Mock de logout
app.post('/sessions/logout', (req, res) => {
  console.log('Logout request recebido');
  res.json({ message: 'Logout realizado com sucesso' });
});

// 404 handler
app.use((req, res) => {
  console.log('Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('=====================================');
  console.log(`🚀 Mock server rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/sessions/login-by-cpf`);
  console.log(`👤 Me endpoint: http://localhost:${PORT}/sessions/me`);
  console.log('=====================================');
  console.log('Para testar o login, use:');
  console.log('- CPF: 43501465718');
  console.log('- Senha: senha123');
  console.log('=====================================');
});
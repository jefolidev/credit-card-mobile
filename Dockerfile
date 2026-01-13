# Use uma imagem oficial do Node.js como base
FROM node:20-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o resto dos arquivos da aplicação
COPY . .

# Exponha a porta que o mock server irá usar
EXPOSE 3001

# Comando para iniciar o mock server
CMD ["npm", "run", "mock-server"]
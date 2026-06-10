# 🌍 CRUD Mundo - Atividade Avaliativa FATEC

Projeto full-stack desenvolvido para a disciplina de Banco de Dados/Programação, gerenciando Continentes, Países e Cidades com integrações a APIs externas.

## 🚀 Tecnologias Utilizadas
* **Banco de Dados:** MySQL
* **Backend:** Node.js, Express, Prisma ORM
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios
* **APIs Externas:** REST Countries (Dados Geográficos) e OpenWeatherMap (Clima em Tempo Real)

---

## ⚙️ Como inicializar o projeto

### 1. Backend e Banco de Dados (Pasta `server`)
Abra o terminal na pasta `server` e modifique os seguintes arquivos antes de rodar:

Crie um arquivo `.env` na raiz da pasta `server` com as suas credenciais:
```env
DATABASE_URL="mysql://Usuario:Senha@localhost:3306/NomeDoSeuBanco"
OPENWEATHER_API_KEY="sua_chave_da_api_de_clima"
```

*(Lembre-se de substituir Usuario, Senha e NomeDoSeuBanco pelos dados reais do seu MySQL).*

No terminal da pasta `server`, execute os comandos na ordem:

* `npm install` - Instala todas as dependências do servidor.
* `npx prisma migrate dev` - Cria as tabelas do banco de dados automaticamente.
* `npm run dev` - Inicializa o projeto localmente na porta `http://localhost:3333`.

### 2. Interface Gráfica (Pasta `web`)
Abra um novo terminal, navegue até a pasta `web` e execute:

* `npm install` - Instala as dependências do React.
* `npm run dev` - Inicializa a interface web na porta `http://localhost:5173`.

---

## 🔐 Acesso ao Sistema (Login)
Para acessar o painel do CRUD, utilize as credenciais padrão simuladas no frontend:

* **Usuário:** `admin`
* **Senha:** `1234`

---

## 📂 Scripts e Estrutura

### Prisma
A configuração do banco e das tabelas está automatizada em:

* `server/prisma/schema.prisma`

### Scripts Principais
* `npm run dev` - Inicializa os servidores de desenvolvimento (tanto no web quanto no server).
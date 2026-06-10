import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient(); // Agora sim, vazio e funcionando!

app.use(cors());
app.use(express.json());

app.get('/teste', async (req, res) => {
  res.json({ mensagem: 'Servidor CRUD Mundo rodando perfeito na versão estável! 🌍' });
});

app.listen(3333, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:3333`);
});

// ==========================================
// ROTAS DE CONTINENTES
// ==========================================

// 1. CREATE - Inserir um novo continente
app.post('/continentes', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    
    const novoContinente = await prisma.continent.create({
      data: {
        nome,
        descricao
      }
    });
    
    res.status(201).json(novoContinente);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar o continente' });
  }
});

// 2. READ - Listar todos os continentes
app.get('/continentes', async (req, res) => {
  try {
    const continentes = await prisma.continent.findMany();
    res.json(continentes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar continentes' });
  }
});

// 3. UPDATE - Alterar um continente existente
app.put('/continentes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    
    const continenteAtualizado = await prisma.continent.update({
      where: { id: Number(id) },
      data: {
        nome,
        descricao
      }
    });
    
    res.json(continenteAtualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar o continente' });
  }
});

// 4. DELETE - Excluir um continente
app.delete('/continentes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.continent.delete({
      where: { id: Number(id) }
    });
    
    res.status(204).send(); // Status 204 significa "Sucesso, mas sem conteúdo para retornar"
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar o continente' });
  }
});

// ==========================================
// ROTAS DE PAÍSES
// ==========================================

// 1. CREATE - Inserir um país vinculado a um continente
app.post('/paises', async (req, res) => {
  try {
    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;
    
    const novoPais = await prisma.country.create({
      data: {
        nome,
        populacao,
        idioma_oficial,
        moeda,
        id_continente // Aqui entra o ID do continente que você já criou!
      }
    });
    
    res.status(201).json(novoPais);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar o país' });
  }
});

// 2. READ - Listar todos os países (trazendo o continente junto)
app.get('/paises', async (req, res) => {
  try {
    const paises = await prisma.country.findMany({
      include: {
        continente: true // Mágica do Prisma: faz o JOIN automaticamente!
      }
    });
    res.json(paises);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar países' });
  }
});

// 3. UPDATE - Alterar um país
app.put('/paises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;
    
    const paisAtualizado = await prisma.country.update({
      where: { id: Number(id) },
      data: { nome, populacao, idioma_oficial, moeda, id_continente }
    });
    
    res.json(paisAtualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar o país' });
  }
});

// 4. DELETE - Excluir um país
app.delete('/paises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.country.delete({
      where: { id: Number(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar o país' });
  }
});

// ==========================================
// ROTAS DE CIDADES
// ==========================================

// 1. CREATE - Inserir uma cidade vinculada a um país
app.post('/cidades', async (req, res) => {
  try {
    const { nome, populacao, latitude, longitude, id_pais } = req.body;
    
    const novaCidade = await prisma.city.create({
      data: {
        nome,
        populacao,
        latitude,
        longitude,
        id_pais // Vinculação obrigatória com o país
      }
    });
    
    res.status(201).json(novaCidade);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar a cidade' });
  }
});

// 2. READ - Listar cidades (trazendo o país junto)
app.get('/cidades', async (req, res) => {
  try {
    const cidades = await prisma.city.findMany({
      include: {
        pais: true // Traz os dados do país junto com a cidade
      }
    });
    res.json(cidades);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar cidades' });
  }
});

// 3. UPDATE - Alterar uma cidade
app.put('/cidades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, populacao, latitude, longitude, id_pais } = req.body;
    
    const cidadeAtualizada = await prisma.city.update({
      where: { id: Number(id) },
      data: { nome, populacao, latitude, longitude, id_pais }
    });
    
    res.json(cidadeAtualizada);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar a cidade' });
  }
});

// 4. DELETE - Excluir uma cidade
app.delete('/cidades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.city.delete({
      where: { id: Number(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar a cidade' });
  }
});

// ==========================================
// INTEGRAÇÃO COM API EXTERNA (OPENWEATHERMAP)
// ==========================================

// Rota para buscar o clima de uma cidade específica
app.get('/cidades/:id/clima', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Busca a cidade no banco de dados para pegar a Latitude e Longitude
    const cidade = await prisma.city.findUnique({
      where: { id: Number(id) }
    });

    if (!cidade) {
      return res.status(404).json({ erro: 'Cidade não encontrada no banco de dados.' });
    }

    // 2. Monta a URL da API do OpenWeatherMap (units=metric traz em Celsius e lang=pt_br traduz)
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cidade.latitude}&lon=${cidade.longitude}&appid=${apiKey}&units=metric&lang=pt_br`;

    // 3. Faz a requisição nativa para a API externa
    const respostaClima = await fetch(url);
    const dadosClima = await respostaClima.json();

    // Se a API do clima retornar erro (ex: chave inativa ainda)
    if (dadosClima.cod !== 200) {
      return res.status(dadosClima.cod).json({ erro: dadosClima.message });
    }

    // 4. Retorna um JSON limpo e formatado para o nosso Frontend usar depois
    res.json({
      cidade: cidade.nome,
      temperatura_atual: `${dadosClima.main.temp} °C`,
      sensacao_termica: `${dadosClima.main.feels_like} °C`,
      clima: dadosClima.weather[0].description,
      umidade: `${dadosClima.main.humidity}%`
    });

  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar dados de clima' });
  }
});

// Rota para buscar dados geográficos e bandeira de um país
app.get('/paises/:id/info', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Busca o país no nosso banco de dados
    const pais = await prisma.country.findUnique({
      where: { id: Number(id) }
    });

    if (!pais) {
      return res.status(404).json({ erro: 'País não encontrado no banco de dados.' });
    }

    // 2. Chama a API do REST Countries usando o nome do país
    // Usamos o endpoint de tradução porque nossos dados estão em Português (ex: "Brasil")
    const url = `https://restcountries.com/v3.1/translation/${pais.nome}`;

    const respostaREST = await fetch(url);
    
    if (!respostaREST.ok) {
      return res.status(respostaREST.status).json({ erro: 'País não encontrado na API externa.' });
    }

    const dadosREST = await respostaREST.json();
    const infoPais = dadosREST[0]; // A API retorna um array, pegamos o primeiro

    // 3. Retorna um JSON combinando nossos dados com a API externa
    res.json({
      pais_local: pais.nome,
      capital: infoPais.capital ? infoPais.capital[0] : 'Não informada',
      regiao_global: infoPais.region,
      populacao_global: infoPais.population,
      bandeira_url: infoPais.flags.svg // Link direto para a imagem da bandeira!
    });

  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao buscar dados geográficos' });
  }
});

app.listen(3333, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:3333`);
});
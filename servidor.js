const express = require('express');
const axios = require('axios');
const app = express();

const TARGET_SERVERS = [
  'https://agrosystem.onrender.com/ping',
];

const MAX_INTERVAL = 300000; // Intervalo máximo de 5 minutos (5 minutos = 300.000 ms)

const PORT = process.env.PORT || 3000;

// Função para gerar intervalo aleatório entre 0 e MAX_INTERVAL
function getRandomInterval() {
  return Math.floor(Math.random() * MAX_INTERVAL);
}

// Função para fazer a chamada HTTP para os servidores de destino
async function makeRequests() {
  for (const server of TARGET_SERVERS) {
    try {
      const response = await axios.get(server);
      console.log(`Requisição bem-sucedida para ${server}: ${response.status} - ${response.data}`);
    } catch (error) {
      console.error(`Erro ao fazer a requisição para ${server}: ${error.message}`);
    }
  }
}

// Função que será ativada quando a rota /pong for chamada
async function handlePongRequest() {
  console.log('Recebido /pong. Agendando chamadas para os servidores de ping...');

  // Dispara uma requisição para os servidores de destino após um intervalo aleatório
  const interval = getRandomInterval();
  console.log(`A próxima chamada de ping será feita em ${interval / 1000} segundos.`);

  setTimeout(async () => {
    await makeRequests();  // Faz a requisição para os servidores de ping
    console.log('Ping enviado aos servidores de resposta.');
  }, interval);
}

// Rota /pong que recebe o "pong" e aciona a função de fazer os pings
app.get('/pong', async (req, res) => {
  await handlePongRequest();
  res.send('Requisição /pong recebida e pings agendados.');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor de pings rodando na porta ${PORT}`);
});

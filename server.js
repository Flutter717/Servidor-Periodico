const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const TARGET_SERVERS = [
  'https://example.com/api1',
  'https://example.com/api2',
  'https://example.com/api3' // Adicione mais URLs conforme necessário
];
const MAX_INTERVAL = 600000; // Intervalo máximo de 10 minutos em milissegundos

// Função para gerar intervalo aleatório entre 0 e MAX_INTERVAL
function getRandomInterval() {
  return Math.floor(Math.random() * MAX_INTERVAL);
}

// Função para fazer a chamada HTTP a todos os servidores
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

// Função para agendar chamadas aleatórias
function scheduleRandomCalls() {
  const interval = getRandomInterval();
  console.log(`Próxima chamada em ${interval / 1000} segundos.`);

  setTimeout(async () => {
    await makeRequests();
    scheduleRandomCalls();
  }, interval);
}

app.get('/', (req, res) => {
  res.send('Servidor rodando e agendando chamadas aleatórias para múltiplos servidores.');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  scheduleRandomCalls();
});

const express = require('express');
const axios = require('axios');
const app = express();

const TARGET_SERVERS = [
  'https://agrosystem.onrender.com/ping',
];

const MAX_INTERVAL = 300000; // 5 minutos em milissegundos
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Função para gerar um intervalo aleatório entre 0 e MAX_INTERVAL
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

// Função que executa o ping imediatamente e agenda o próximo ping
async function schedulePing() {
  console.log("Executando ping imediato aos servidores...");
  await makeRequests();
  console.log("Ping enviado aos servidores de resposta.");

  // Gera um intervalo aleatório para o próximo ping
  const interval = getRandomInterval();
  const minutes = Math.floor(interval / 60000);
  const seconds = Math.floor((interval % 60000) / 1000);
  console.log(`O próximo ping será em ${minutes} minuto(s) e ${seconds} segundo(s).`);

  setTimeout(schedulePing, interval);
}

// Rota opcional para disparar o ping manualmente via /pong
app.get('/pong', async (req, res) => {
  console.log("Rota /pong chamada, executando ping imediato.");
  await makeRequests();
  res.send('Ping executado manualmente via /pong.');
});

// Inicia o servidor e dispara o primeiro ping imediatamente
app.listen(PORT, () => {
  console.log(`Servidor de pings rodando na porta ${PORT}`);
  schedulePing();
});

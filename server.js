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

// Função que executa o ping e agenda o próximo ping automaticamente
async function schedulePing() {
  console.log("Executando ping imediato aos servidores...");
  await makeRequests();
  console.log("Ping enviado aos servidores de resposta.");

  // Agenda o próximo ping em um tempo aleatório
  const interval = getRandomInterval();
  const minutes = Math.floor(interval / 60000);
  const seconds = Math.floor((interval % 60000) / 1000);
  console.log(`O próximo ping automático será em ${minutes} minuto(s) e ${seconds} segundo(s).`);

  setTimeout(schedulePing, interval);
}

// Rota /pong: quando chamada, agenda um ping para ser enviado após um tempo aleatório
app.get('/pong', async (req, res) => {
  const interval = getRandomInterval();
  const minutes = Math.floor(interval / 60000);
  const seconds = Math.floor((interval % 60000) / 1000);
  console.log(`Rota /pong chamada. Agendando ping para daqui a ${minutes} minuto(s) e ${seconds} segundo(s).`);

  setTimeout(async () => {
    console.log("Executando ping agendado via /pong...");
    await makeRequests();
    console.log("Ping enviado aos servidores de resposta (agendado via /pong).");
  }, interval);

  res.send(`Pong recebido. Ping agendado para daqui a ${minutes} minuto(s) e ${seconds} segundo(s).`);
});

// Inicia o servidor e dispara o ciclo automático de pings
app.listen(PORT, () => {
  console.log(`Servidor de pings rodando na porta ${PORT}`);
  schedulePing();
});

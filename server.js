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

// Rota /pong: apenas registra que recebeu um pong e identifica o servidor emissor
app.get('/pong', (req, res) => {
  // Tenta identificar o servidor que enviou o pong via query string ou usa o IP da requisição
  const server = req.query.server || req.ip;
  console.log(`Recebido pong de: ${server}`);
  res.send(`Pong recebido de: ${server}`);
});

// Inicia o servidor e dispara o ciclo automático de pings
app.listen(PORT, () => {
  console.log(`Servidor de pings rodando na porta ${PORT}`);
  // Dispara o primeiro ping imediatamente ao iniciar o servidor
  schedulePing();
});

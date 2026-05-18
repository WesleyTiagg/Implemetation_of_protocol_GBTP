import { formatGBTPRequest, parseGBTPResponse, GBTPRequest } from './protocol.js';

// Tarefa do Nilson: WebSocket e Integração

const SERVER_URL = 'ws://localhost:3000'; // Ajustar para o IP/Porta do servidor
let socket: WebSocket;

function connectWebSocket() {
    socket = new WebSocket(SERVER_URL);

    socket.onopen = () => {
        console.log("Conectado ao servidor GBTP");
    };

    socket.onmessage = (event) => {
        // Recebe a mensagem, passa pro Wesley (parser) e atualiza a tela da Ana
        const responseText = event.data;
        console.log("Recebido:\n", responseText);
        
        const parsedResponse = parseGBTPResponse(responseText);
        updateInterface(parsedResponse);
    };

    socket.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
    };

    socket.onclose = () => {
        console.log("Conexão fechada");
    };
}

// Pegar elementos da Interface (Ana)
const btnSend = document.getElementById('sendBtn') as HTMLButtonElement;
const elStatus = document.getElementById('resStatus') as HTMLSpanElement;
const elMessage = document.getElementById('resMessage') as HTMLSpanElement;
const elBalance = document.getElementById('resBalance') as HTMLSpanElement;

btnSend.addEventListener('click', () => {
    // Coleta dados da interface
    const request: GBTPRequest = {
        operation: (document.getElementById('operation') as HTMLSelectElement).value,
        accountId: (document.getElementById('accountId') as HTMLInputElement).value,
        toAccountId: (document.getElementById('toAccountId') as HTMLInputElement).value,
        value: (document.getElementById('value') as HTMLInputElement).value
    };

    // Formata usando a lógica do Wesley
    const formattedMessage = formatGBTPRequest(request);
    console.log("Enviando:\n", formattedMessage);

    // Envia pro servidor WebSocket (Nilson)
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(formattedMessage);
    } else {
        alert("WebSocket não está conectado.");
    }
});

function updateInterface(response: { status: string, message: string, balance: string }) {
    elStatus.textContent = response.status;
    elMessage.textContent = response.message;
    elBalance.textContent = response.balance;
}

// Inicia a conexão ao carregar o script
connectWebSocket();

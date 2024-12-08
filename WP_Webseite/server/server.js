const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 30000;

app.use(cors());
app.use(express.json());
app.use(express.static('client'));  // Statische Dateien (HTML, CSS, JS)

const server = http.createServer(app); // HTTP-Server für WebSocket
const wss = new WebSocket.Server({ server }); // WebSocket-Server auf demselben HTTP-Server

wss.on('connection', (ws) => {
    console.log('Ein Client hat sich verbunden.');
    ws.send(JSON.stringify({ name: "Server", text: "Willkommen im Chat!" }));

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message); // Nachricht als JSON interpretieren
            const { name, text } = parsedMessage;
  
            if (name && text) {
                console.log(`Nachricht vom Client (${name}): ${text}`);
  
                // Nachricht an andere Clients weiterleiten
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        const outgoingMessage = JSON.stringify({ name, text });
                        client.send(outgoingMessage); // Nachricht senden
                    }
                });
            } else {
                console.log('Ungültige Nachricht: Name oder Text fehlen.');
            }
        } catch (error) {
            console.error('Fehler beim Verarbeiten der Nachricht:', error.message);
        }
    });

    ws.on('close', () => {
        console.log('Ein Client hat die Verbindung geschlossen.');
    });
});

server.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 30000;


app.use(cors());
app.use(express.json());
app.use(express.static('client'));  // Statische Dateien (HTML, CSS, JS)


// Verbindung zur MySQL-Datenbank herstellen
const db = mysql.createConnection({
    host: 'localhost',   // Der Hostname des MySQL-Servers (normalerweise localhost)
    user: 'root',        // Dein MySQL-Benutzername
    password: '1234',        // Dein MySQL-Passwort
    database: 'chat_app_db'  // Name der Datenbank
  });
  
  // Mit der Datenbank verbinden
  db.connect((err) => {
    if (err) {
      console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
      return;
    }
    console.log('Erfolgreich mit der Datenbank verbunden.');
  });


const server = http.createServer(app); // HTTP-Server für WebSocket
const wss = new WebSocket.Server({ server }); // WebSocket-Server auf demselben HTTP-Server

wss.on('connection', (ws) => {
    console.log('Ein Client hat sich verbunden.');

    ws.send(JSON.stringify({ name: "Server", text: "Willkommen im Chat!" }));

    // Nachricht vom Client empfangen
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message); // Nachricht als JSON interpretieren
            const { name, text } = parsedMessage;

            if (name && text) {
                console.log(`Nachricht vom Client (${name}): ${text}`);
                
                // Hole die user_id aus der Datenbank für den Benutzernamen
                const query = 'SELECT id FROM users WHERE username = ?';
                db.query(query, [name], (err, result) => {
                    if (err) {
                        console.error('Fehler beim Abrufen der user_id:', err);
                        return;
                    }

                    if (result.length > 0) {
                        const userId = result[0].id; // Hole die user_id
                        
                        // Speichere die Nachricht in der Datenbank mit der user_id
                        const insertQuery = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
                        db.query(insertQuery, [userId, text], (err) => {
                            if (err) {
                                console.error('Fehler beim Speichern der Nachricht:', err);
                            } else {
                                console.log('Nachricht erfolgreich gespeichert.');
                            }
                        });

                        // Nachricht an alle anderen Clients weiterleiten
                        wss.clients.forEach((client) => {
                            if (client !== ws && client.readyState === WebSocket.OPEN) {
                                const outgoingMessage = JSON.stringify({ name, text });
                                client.send(outgoingMessage); // Nachricht senden
                            }
                        });
                    } else {
                        console.log('Benutzer nicht gefunden!');
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


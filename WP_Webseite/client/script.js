const socket = new WebSocket('ws://localhost:30000');

// Globale Variable für den Client-Namen
let clientName = "";

// Verbindung geöffnet
socket.addEventListener('open', () => {
    console.log('WebSocket-Verbindung geöffnet.');
    // Den Namen des Clients abfragen
    clientName = prompt('Bitte gib deinen Namen ein:'); // Den Namen speichern
    sendMessage('Hallo, ich bin verbunden!'); // Nachricht senden
});

// Nachricht vom Server empfangen
socket.addEventListener('message', (event) => {
    console.log('Nachricht vom Server:', event.data);
});

// Verbindung geschlossen
socket.addEventListener('close', () => {
    console.log('WebSocket-Verbindung geschlossen.');
});

// Fehler behandeln
socket.addEventListener('error', (error) => {
    console.error('WebSocket-Fehler:', error);
});

// Nachricht mit Name senden
function sendMessage(message) {
    if (message.trim() !== '') { // Wenn die Nachricht nicht leer ist
        const messageObject = { name: clientName, text: message }; // Nachricht + Name als Objekt
        socket.send(JSON.stringify(messageObject)); // Nachricht als JSON-String senden
    }
}

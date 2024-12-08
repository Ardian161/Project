const socket = new WebSocket('ws://localhost:30000');

// Globale Variable für den Client-Namen
let clientName = "";

// Wenn die WebSocket-Verbindung geöffnet wird
socket.addEventListener('open', () => {
    console.log('WebSocket-Verbindung geöffnet.');

    // Name über das Overlay abfragen
    document.getElementById('submitNameButton').addEventListener('click', () => {
        const nameInput = document.getElementById('nameInput').value.trim();
        if (nameInput) {
            clientName = nameInput; // Speichere den Namen
            document.getElementById('nameOverlay').style.display = 'none'; // Verstecke Overlay
        } else {
            alert('Bitte gib einen Namen ein!');
        }
    });
});



// Nachricht vom Server empfangen
socket.addEventListener('message', (event) => {
    try {
        const { name, text } = JSON.parse(event.data); // Nachricht als JSON parsen
        console.log(`Nachricht von: "${name}", Client Name: "${clientName}"`);; // Debugging-Ausgabe
        displayMessage(name, text); // Nachricht im Chat-Fenster anzeigen
    } catch (error) {
        console.error('Fehler beim Verarbeiten der Nachricht:', error.message, event.data);
    }
});


// Funktion zum Anzeigen der Nachricht im Chat-Fenster
// Funktion zum Anzeigen der Nachricht im Chat-Fenster
// Funktion zum Anzeigen der Nachricht im Chat-Fenster
function displayMessage(name, text) {
    const chatWindow = document.getElementById('chatWindow');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${name}: ${text}`;

    // Überprüfe, ob die Nachricht vom Client selbst kommt
    if (name === clientName) {
        messageElement.classList.add('self'); // Eigene Nachricht nach rechts verschieben
        console.log("Eigene Nachricht erkannt!"); // Debugging
    } else {
        messageElement.classList.add('other'); // Nachrichten von anderen nach links verschieben
        console.log("Nachricht von anderen erkannt!"); // Debugging
    }

    chatWindow.appendChild(messageElement);
}


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

        // Nachricht auch im eigenen Chat-Fenster anzeigen
        const chatWindow = document.getElementById('chatWindow');
        const messageElement = document.createElement('div');
        messageElement.textContent = `Du: ${message}`;
        chatWindow.appendChild(messageElement); // Nachricht zum Chat-Fenster hinzufügen

        // Eingabefeld leeren und Fokus setzen
        const messageInput = document.getElementById('messageInput');
        messageInput.value = ''; // Eingabefeld leeren
        messageInput.focus(); // Fokus auf das Eingabefeld setzen
    }
}


// Event-Listener für den Send-Button
document.getElementById('sendMessageButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput'); // Eingabefeld
    const message = messageInput.value.trim(); // Wert aus Eingabefeld holen
    
    if (message !== '') { // Nur senden, wenn die Nachricht nicht leer ist
        sendMessage(message); // Nachricht senden
        messageInput.value = ''; // Eingabefeld nach dem Senden leeren
    }
});

// Funktion, um Nachrichten zu senden, wenn Enter gedrückt wird
document.getElementById('messageInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // Prüfen, ob die Enter-Taste gedrückt wurde
        const message = document.getElementById('messageInput').value; // Nachricht aus dem Eingabefeld holen
        sendMessage(message); // Nachricht senden
        document.getElementById('messageInput').value = ''; // Eingabefeld leeren
    }
});

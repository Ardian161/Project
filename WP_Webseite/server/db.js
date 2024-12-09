const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',       // Dein MySQL-Server (meistens localhost)
  user: 'root',            // Dein MySQL-Benutzername
  password: '1234',            // Dein MySQL-Passwort
  database: 'chat_app_db'  // Der Name deiner Datenbank
});

connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
  } else {
    console.log('Erfolgreich mit der Datenbank verbunden.');
  }
});

module.exports = connection;

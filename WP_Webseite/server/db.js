const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',       
  user: 'root',            
  password: '1234',         
  database: 'chat_app_db' 
});

connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
  } else {
    console.log('Erfolgreich mit der Datenbank verbunden.');
  }
});

module.exports = connection;

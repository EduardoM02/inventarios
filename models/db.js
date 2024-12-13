const mysql = require('mysql2');

const connection = mysql.createConnection({

    host: 'localhost',         // XAMPP usa localhost por defecto
    user: 'root',              // Usuario por defecto de MySQL en XAMPP
    password: '',              // Por defecto, no hay contraseña (campo vacío)
    database: 'inventariodb'  // Nombre de tu base de datos

});

connection.connect((err) => {

    if (err) {

        console.error('Error conectando a la base de datos:', err);
        return;

    }

    console.log('Conectado a la base de datos MySQL.');

});


module.exports = connection;

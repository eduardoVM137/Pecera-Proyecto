const express = require('express');
const mysql = require('mysql2');
const moment = require('moment');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',      // Cambia a la IP o dominio del servidor MySQL
    user: 'root',           // Cambia al usuario de tu base de datos
    password: '',// Cambia a la contraseña del usuario
    database: 'kraken_fishguard' // Base de datos creada anteriormente
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conexión a MySQL exitosa');
});


// Endpoint para recibir datos
app.post('/envio/temperatura', (req, res) => {
    const { temperatura } = req.body;
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss.SSSSSS');

    if (temperatura !== undefined) {
        const query = 'INSERT INTO temperatura (Temperatura, Fecha) VALUES (?, ?)';
        db.query(query, [temperatura, currentTime], (err, results) => {
            if (err) {
                console.error('Error al insertar datos:', err);
                res.status(500).send('Error al insertar datos en la base de datos');
                return;
            }
            res.status(200).json({ message: 'Datos insertados correctamente', results });
        });
    } else {
        res.status(400).send('Solicitud inválida: faltan parámetros');
    }
});


// Endpoint para obtener todos los datos
app.get('/mostrar/temperatura', (req, res) => {
    const query = 'SELECT * FROM temperatura ORDER BY Fecha DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).send('Error al obtener datos de la base de datos');
            return;
        }
        res.status(200).json(results); // Devuelve los datos en formato JSON
    });
});



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

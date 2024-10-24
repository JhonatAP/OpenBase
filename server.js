const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const url = 'mongodb://localhost:27017';  // Cambia a tu URI si usas MongoDB Atlas
const dbName = 'walletDB';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log("Conectado a la base de datos");
});

app.use(bodyParser.json());

// Ruta para guardar la llave
app.post('/guardar-llave', (req, res) => {
    const { walletKey, userData } = req.body;
    db.collection('wallets').insertOne({ walletKey, userData }, (err, result) => {
        if (err) {
            res.status(500).send('Error al guardar la llave');
        } else {
            res.status(200).send('Llave guardada correctamente');
        }
    });
});

// Ruta para mostrar los datos de la llave
app.get('/info', (req, res) => {
    db.collection('wallets').find({}).toArray((err, result) => {
        if (err) {
            res.status(500).send('Error al obtener los datos');
        } else {
            res.status(200).json(result);
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});


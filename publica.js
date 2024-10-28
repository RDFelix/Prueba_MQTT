const express = require('express');
const fs = require('fs');
const mqtt = require('mqtt');

const app = express();
let sensorData = {};

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

app.get('/', (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al cargar el archivo HTML');
        } else {
            res.send(data);
        }
    });
});

app.get('/sensordata-json', (req, res) => {
    res.json(sensorData);
});

const url = 'e0287b1c3b054ddf98ec84843d94fec5.s1.eu.hivemq.cloud';
const puerto = 8883;
const options = {
    username: 'grupo6',
    password: 'Sena2024',
    clientId: 'losStrings',
    rejectUnauthorized: false
};

const client = mqtt.connect(`mqtts://${url}:${puerto}`, options);

client.on('connect', function () {
    client.subscribe('data/sensor');
});

client.on('message', function (topic, message) {
    try {
        console.log('Datos:', message.toString());
        sensorData = JSON.parse(message.toString());
    } catch (error) {
        console.error('Error al procesar los datos del sensor:', error);
    }
});
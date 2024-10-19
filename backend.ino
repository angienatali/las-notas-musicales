const express = require('express');
const SerialPort = require('serialport');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 }); // Cambia el path según tu configuración

app.post('/api/play-note', (req, res) => {
    const { note } = req.body;
    port.write(note, (err) => {
        if (err) {
            return res.status(500).send('Error writing to serial port');
        }
        res.send('Note played');
    });
});

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
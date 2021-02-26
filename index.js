const express = require('express');
const multer = require('multer');
const sentencer = require('sentencer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, back) => {
        back(null, './tacos');
    },
    filename: (req, file, back) => {
        let file_name = sentencer.make("{{adjective}}-{{noun}}") + path.extname(file.originalname);

        back(null, file_name);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000000
    }
});

const app = express();

app.get('/', (req, res) => {
    res.send('A challenger approaches...');
});

app.get('/:file', (req, res) => {
    res.sendFile(path.join(__dirname, "tacos", req.params.file), () => {
        res.status(404).send("file not found.");
    });
});

app.post('/', upload.single( "file" ), (req, res) => {

    res.send(req.file.filename);
});

app.listen(3000, () => console.log('Taco Cart is serving tacos on port 3000.'));

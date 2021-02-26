const express = require('express');
const multer = require('multer');
const sentencer = require('sentencer');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let port = process.env.TACOCART_PORT || 3000;
let host = process.env.TACOCART_HOST || 'localhost:3000';

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
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/:file', (req, res) => {
    res.download(path.join(__dirname, "tacos", req.params.file), (err) => {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', req.params.file);
        }
    });
});

app.post('/', upload.single( "file" ), (req, res) => {
    console.log("Uploaded:", req.file.filename);
    res.send(host + "/" + req.file.filename + "\n");
});

app.listen(port, () => console.log('Taco Cart is serving tacos on port 3000.'));

const express = require('express');
const multer = require('multer');
const sentencer = require('sentencer');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

let port = process.env.TACOCART_PORT || 3000;
let host = process.env.TACOCART_HOST || 'localhost:3000';
let minutes = process.env.TACOCART_MINUTES || 30;
let max_age = process.env.TACOCART_MAX_AGE || 7;
let max_age_once = process.env.TACOCART_MAX_AGE_ONCE || 1;
let check_interval = minutes * 60 * 1000

let standard_storage = path.join(__dirname, "tacos");
if (!fs.existsSync(standard_storage)) {
    fs.mkdirSync(standard_storage);
}

let once_storage = path.join(standard_storage, "supreme");
if (!fs.existsSync(once_storage)) {
    fs.mkdirSync(once_storage);
}

async function file_cleanup(folder, age) {
    const files = await fs.promises.readdir(folder);
    for (const file of files) {

        const info = await fs.promises.stat(path.join(folder, file))
        if (info.isFile()) {
            let check_date = new Date();
            check_date.setDate(check_date.getDate() - age);

            if (info.mtime < check_date) {
                fs.rmSync(path.join(folder, file));
                console.log("File Expired:", file);
            }
        }
    }
}

setInterval(async () => {
    try {
        await file_cleanup(standard_storage, max_age);
        await file_cleanup(once_storage, max_age_once);
    } catch (e) {
        console.log("Error:", e);
    }
}, check_interval);

const store_manager = multer.diskStorage({
    destination: (req, file, back) => {
        if (req.path === "/once") {
            console.log("yes");
            back(null, './tacos/supreme');
        } else {
            back(null, './tacos');
        }
    },
    filename: (req, file, back) => {
        let file_name = sentencer.make("{{adjective}}-{{noun}}") + path.extname(file.originalname);

        back(null, file_name);
    }
});

const upload = multer({
    storage: store_manager,
    limits: {
        fileSize: 5000000000
    }
});

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/:file', (req, res) => {
    if (fs.existsSync(path.join(once_storage, req.params.file))) {
        res.download(path.join(once_storage, req.params.file), (err) => {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Sent:', req.params.file);
                fs.rmSync(path.join(once_storage, req.params.file));
                console.log('Deleted:', req.params.file);
            }
        });
    } else {
        res.download(path.join(standard_storage, req.params.file), (err) => {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('Sent:', req.params.file);
            }
        });
    }
});

app.post('/', upload.single( "file" ), (req, res) => {
    console.log("Uploaded:", req.file.filename);
    res.send(host + "/" + req.file.filename + "\n");
});

app.post('/once', upload.single("file"), (req, res) => {
    console.log("Uploaded once:", req.file.filename);
    res.send( host + "/" + req.file.filename + "\n");
})

app.listen(port, () => console.log('Taco Cart is serving tacos on port 3000.'));

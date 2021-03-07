// deprecate
//import Koa from "koa";
//import render from "koa-ejs";

const Koa = require('koa');
const render = require('koa-ejs');
const routes = require('./routes');

// const express = require('express');
//import * as routes from './routes/index';

const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const crypto = require('crypto');

const config = require('./config');

//const bodyParser = require("body-parser");


const app = new Koa();

render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: true
});

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

//app.set('view engine', 'ejs');


let check_interval = config.upload.cleanup * 60 * 1000

let standard_storage = path.join(__dirname, "tacos");
if (!fs.existsSync(standard_storage)) {
    fs.mkdirSync(standard_storage);
}

let once_storage = path.join(standard_storage, "supreme");
if (!fs.existsSync(once_storage)) {
    fs.mkdirSync(once_storage);
}

let wrap_storage = path.join(standard_storage, "wrap");
if (!fs.existsSync(wrap_storage)) {
    fs.mkdirSync(wrap_storage);
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
                console.log("File Expired:", file, ":", info.mtime);
            }
        }
    }
}

setInterval(async () => {
    try {
        await file_cleanup(standard_storage, app_config.max_age);
        await file_cleanup(once_storage, app_config.max_age_once);
        await file_cleanup(wrap_storage, app_config.max_age_wrap);
    } catch (e) {
        console.log("Error:", e);
    }
}, check_interval);

// ROUTER
Object.keys(routes).forEach((routeKey) =>app.use(routes[routeKey].routes()));

/*app.get('/', (req, res) => {
    res.render('index', {config: app_config});
});*/

/*app.get('/:file', (req, res) => {
    if (fs.existsSync(path.join(once_storage, req.params.file))) {
        res.download(path.join(once_storage, req.params.file), (err) => {
            if (err) {
                console.log(err);
                res.sendStatus(err.status)
            } else {
                console.log('Sent:', req.params.file);
                fs.rmSync(path.join(once_storage, req.params.file));
                console.log('Deleted:', req.params.file);
            }
        });
    } else {
        res.download(path.join(standard_storage, req.params.file), (err) => {
            if (err) {
                //console.log(err);
                res.sendStatus(err.status);
            } else {
                console.log('Sent:', req.params.file);
            }
        });
    }
});*/

/*app.post('/', upload.single( "file" ), (req, res) => {
    console.log("Uploaded:", req.file.filename);
    res.send(app_config.host + "/" + req.file.filename + "\n");
});*/

/*app.post('/once', upload.single("file"), (req, res) => {
    console.log("Uploaded once:", req.file.filename);
    res.send( app_config.host + "/" + req.file.filename + "\n");
})*/

const encrypt = (text) => {
    const key = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(app_config.cipher_algorithm, app_config.cipher_key, key);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        key: key.toString('hex'),
        content: encrypted
    };
}

const decrypt = (text, key) => {
    const decipher = crypto.createDecipheriv(app_config.cipher_algorithm, app_config.cipher_key, Buffer.from(key, 'hex'));
    return Buffer.concat([decipher.update(text), decipher.final()]);
}

/*app.post( '/wrap', upload.single("file"), (req, res) => {
    const file_contents = fs.readFileSync(path.join(wrap_storage, req.file.filename),{flag:'r'});

    /!*let hash = encrypt(file_contents);

    fs.writeFileSync(path.join(standard_storage, "test2.txt"), hash.content);

    const file_contents2 = fs.readFileSync(path.join(standard_storage, 'test2.txt'), {flag:'r'});

    let decrypted = decrypt(file_contents2, hash.key);

    fs.writeFileSync(path.join(standard_storage, "test3.txt"), decrypted);

    console.log(file_contents);*!/

    const encrypted = encrypt(file_contents);

    fs.writeFileSync(path.join(wrap_storage, req.file.filename), encrypted.content);

    res.send(app_config.host + "/" + req.file.filename + "\npassword: " + encrypted.key + "\n");
})*/

/*app.post('/:file', (req, res) => {
    if (fs.existsSync(path.join(wrap_storage, req.params.file))) {
        if (!req.body.key) {
            res.sendStatus(401);
            return;
        }

        try {
            const file_contents = fs.readFileSync(path.join(wrap_storage, req.params.file),{flag:'r'});
            const output = decrypt(file_contents, req.body.key);

            let temp_file = path.join(wrap_storage, path.parse(req.params.file).name);
            fs.writeFileSync(temp_file, output);
            res.download(temp_file, (err) => {
                fs.rmSync(temp_file);
                if (err) {
                    if (err.status) {
                        res.sendStatus(err.status);
                    } else {
                        console.log(err);
                    }
                } else {
                    console.log('Sent:', temp_file);
                }
            });
        } catch (e) {
            res.status(401).end()
        }
    }
});*/

app.listen(config.server.port, () => console.log('Taco Cart is serving tacos on port 3000.'));

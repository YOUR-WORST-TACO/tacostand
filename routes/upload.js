const Router = require('@koa/router');
const path = require('path');
const fs = require('fs');
const debug = require('debug');

const upload = require('../resources/multer');
const files = require('../resources/files');
const cipher = require('../resources/cipher');
const host = require('../resources/hostname');

const router = new Router();
const log = debug('tacostand:upload');

router.post('/', upload.single('file'), ctx => {
    log("uploaded: %s using %s method.", ctx.file.filename, 'standard');
    //res.send(app_config.host + "/" + req.file.filename + "\n");
    ctx.body = host() + ctx.file.filename + "\n";
});

router.post('/once', upload.single('file'), ctx => {
    console.log("Uploaded once:", ctx.file.filename);
    //res.send( app_config.host + "/" + req.file.filename + "\n");
    ctx.body = host() + ctx.file.filename + "\n";
});

router.post('/wrap', upload.single('file'), ctx => {
    try {
        const file_contents = fs.readFileSync(path.join(files.storage.wrap, ctx.file.filename), {flag: 'r'});
        const encrypted = cipher.encrypt(file_contents);

        fs.writeFileSync(path.join(files.storage.wrap, ctx.file.filename), encrypted.content);

        ctx.body = host() + ctx.file.filename + "\npassword: " + encrypted.key + "\n";
    } catch (e) {
        console.log(e);
        fs.rmSync(path.join(files.storage.wrap, ctx.file.filename));
        ctx.status = 500;
    }
});

module.exports = router;

const Router = require('@koa/router');
const path = require('path');
const fs = require('fs');

const upload = require('../resources/multer');
const files = require('../resources/files');
const cipher = require('../resources/cipher');

const router = new Router();

router.post('/', upload.single('file'), ctx => {
    console.log("Uploaded:", ctx.file.filename);
    //res.send(app_config.host + "/" + req.file.filename + "\n");
    ctx.body = ctx.file.filename + "\n";
});

router.post('/once', upload.single('file'), ctx => {
    console.log("Uploaded once:", ctx.file.filename);
    //res.send( app_config.host + "/" + req.file.filename + "\n");
    ctx.body = ctx.file.filename + "\n";
});

router.post('/wrap', upload.single('file'), ctx => {
    try {
        const file_contents = fs.readFileSync(path.join(files.storage.wrap, ctx.file.filename), {flag: 'r'});
        const encrypted = cipher.encrypt(file_contents);

        fs.writeFileSync(path.join(files.storage.wrap, ctx.file.filename), encrypted.content);

        ctx.body = ctx.file.filename + "\npassword: " + encrypted.key + "\n";
    } catch (e) {
        console.log(e);
        fs.rmSync(path.join(files.storage.wrap, ctx.file.filename));
        ctx.status = 500;
    }
    //res.send(app_config.host + "/" + req.file.filename + "\npassword: " + encrypted.key + "\n");
});

module.exports = router;

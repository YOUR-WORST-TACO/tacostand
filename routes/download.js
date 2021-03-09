const Router = require('@koa/router');
const koaBody = require('koa-body');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');
const debug = require('debug');

const files = require('../resources/files');
const cipher = require('../resources/cipher');

const router = new Router();
const log = debug('tacostand:upload');

router.get('/:file', (ctx, next) => {
    let file_type = mime.lookup(path.extname(ctx.params.file)) || 'application/octet-stream';
    let location = files.storage.standard;
    if (fs.existsSync(path.join(files.storage.togo, ctx.params.file))) {
        location = files.storage.togo;
    }
    let stream = fs.createReadStream(path.join(location, ctx.params.file));

    stream.on('open', () => {
        ctx.body = stream;
        ctx.set('Content-disposition', 'attachment; filename=' + ctx.params.file);
        ctx.set('Content-type', file_type);
        log("sent file: %s", ctx.params.file);
    });

    stream.on('error', () => {
        ctx.status = 404;
        log("request for nonexistent file: %s", ctx.params.file);
    })
});

router.post('/:file', koaBody(), ctx => {
    //ctx.body = ctx.request.body.key;
    if (fs.existsSync(path.join(files.storage.wrap, ctx.params.file))) {
        if (!ctx.request.body.key) {
            ctx.status = 401;
            log('no key provided');
            return;
        }

        try {
            const file_contents = fs.readFileSync(path.join(files.storage.wrap, ctx.params.file), {flag: 'r'});
            const output = cipher.decrypt(file_contents, ctx.request.body.key);

            const password = ctx.request.body.key;
            const password_length = password.length

            if (output.length < password_length) {
                ctx.status = 501;
                return;
            }

            const store_password = output.slice(0, password_length).toString();
            const content = output.slice(password_length, output.length);

            if (store_password === password) {
                let file_type = mime.lookup(path.extname(path.parse(ctx.params.file).name)) || 'application/octet-stream';

                ctx.body = content;
                ctx.set('Content-disposition', 'attachment; filename=' + path.parse(ctx.params.file).name);
                ctx.set('Content-type', file_type);
                log("sent file: %s of type %s.", path.parse(ctx.params.file).name, file_type);
            } else {
                ctx.status = 401;
                log("Bad password, file not sent");
            }
        } catch (e) {
            console.log(e);
            log("wrong key provided");
            ctx.status = 501;
        }
    }
});

module.exports = router;

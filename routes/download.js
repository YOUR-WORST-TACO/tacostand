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
    if (fs.existsSync(path.join(files.storage.once, ctx.params.file))) {
        location = files.storage.once;
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

            let file_type = mime.lookup(path.extname(path.parse(ctx.params.file).name)) || 'application/octet-stream';

            ctx.body = output.toString();
            ctx.set('Content-disposition', 'attachment; filename=' + path.parse(ctx.params.file).name);
            ctx.set('Content-type', file_type);
            log("sent file: %s", path.parse(ctx.params.file).name);
        } catch (e) {
            log("wrong key provided");
            ctx.status = 501;
        }
    }
});

module.exports = router;

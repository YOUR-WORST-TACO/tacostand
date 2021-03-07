const Router = require('@koa/router');
const koaBody = require('koa-body');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');

const files = require('../resources/files');
const cipher = require('../resources/cipher');

const router = new Router();

router.get('/:file', (ctx, next) => {
    let file_type = mime.lookup(path.extname(ctx.params.file)) || 'application/octet-stream';
    let location = files.storage.standard;
    if (fs.existsSync(path.join(files.storage.once, ctx.params.file))) {
        location = files.storage.once;
    }
    ctx.body = fs.createReadStream(path.join(location, ctx.params.file));
    ctx.set('Content-disposition', 'attachment; filename=' + ctx.params.file);
    ctx.set('Content-type', file_type);
});

router.post('/:file', koaBody(), ctx => {
    //ctx.body = ctx.request.body.key;
    if (fs.existsSync(path.join(files.storage.wrap, ctx.params.file))) {
        console.log("SHIT1")
        if (!ctx.request.body.key) {
            ctx.status = 401;
            return;
        }

        console.log("SHIT2")

        try {
            const file_contents = fs.readFileSync(path.join(files.storage.wrap, ctx.params.file),{flag:'r'});
            console.log("SHIT3")

            const output = cipher.decrypt(file_contents, ctx.request.body.key);

            console.log("SHIT4")
            let file_type = mime.lookup(path.extname(path.parse(ctx.params.file).name)) || 'application/octet-stream';

            console.log(file_type);

            ctx.body = output.toString();
            ctx.set('Content-disposition', 'attachment; filename=' + path.parse(ctx.params.file).name);
            ctx.set('Content-type', file_type);
            //let temp_file = path.join(wrap_storage, path.parse(req.params.file).name);
            //fs.writeFileSync(temp_file, output);
            /*res.download(temp_file, (err) => {
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
            });*/

        } catch (e) {
            console.log(e)
            ctx.status = 501;
        }
    }
});

module.exports = router;

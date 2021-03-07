const Koa = require('koa');
const render = require('koa-ejs');
const routes = require('./routes');

const path = require('path');
const crypto = require('crypto');

const config = require('./config');
const files = require('./resources/files');

files.init();

const app = new Koa();

render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: true
});

// ROUTER
Object.keys(routes).forEach((routeKey) =>app.use(routes[routeKey].routes()));

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

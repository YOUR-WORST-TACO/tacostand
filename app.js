const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const debug = require('debug');

const log = debug('tacostand');

const routes = require('./routes');
const config = require('./config');
const files = require('./resources/files');

files.init();

const app = new Koa();

render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
});

// ROUTER
Object.keys(routes).forEach((routeKey) =>app.use(routes[routeKey].routes()));

app.listen(config.server.port);

log('tacostand running at %s:%s.', config.server.host, config.server.port);

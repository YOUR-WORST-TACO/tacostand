const Router = require('@koa/router');
const config = require('../config');
const host = require('../resources/hostname');

const router = new Router();

router.get('/', async(ctx, next) => {
    await ctx.render('index', {config: config, host: host()});
})

module.exports = router;

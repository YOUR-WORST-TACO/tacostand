const Router = require('@koa/router');
const config = require('../config');
const router = new Router();

router.get('/', async(ctx, next) => {
    await ctx.render('index', {config: config});
})

module.exports = router;

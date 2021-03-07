//import Router from "@koa/router";
const Router = require('@koa/router');
const koaBody = require('koa-body');
//import koaBody from "koa-body";

const router = new Router();

router.get('/:file', (ctx, next) => {
    ctx.body = "Download File";
});

router.post('/:file', koaBody(), ctx => {
    ctx.body = ctx.request.body.key;
});

module.exports = router;

const Router = require('@koa/router');
const upload = require('../resources/multer');

const router = new Router();

router.post('/', upload.single('file'), ctx => {
    ctx.body = "upload normal";
});

router.post('/once', upload.single('file'), ctx => {
    ctx.body = "upload once";
});

router.post('/wrap', upload.single('file'), ctx => {
    ctx.body = "upload wrap";
});

module.exports = router;

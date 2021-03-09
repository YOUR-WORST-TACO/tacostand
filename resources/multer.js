const multer = require('@koa/multer');
const sentencer = require('sentencer');
const path = require('path');
const debug = require('debug');

const log = debug('tacostand:multer');

const store_manager = multer.diskStorage({
    destination: (ctx, file, back) => {
        switch (ctx.url) {
            case "/togo":
                back(null, './tacos/togo');
                break;
            case "/wrap":
                back(null, './tacos/wrap');
                break;
            default:
                back(null, './tacos');
        }
    },
    filename: (ctx, file, back) => {
        let file_name = sentencer.make("{{adjective}}-{{noun}}") + path.extname(file.originalname);

        if (ctx.url === "/wrap") {
            file_name += ".wrap";
        }

        back(null, file_name);
    }
});

log('multer initialized.');

module.exports = multer({
    storage: store_manager,
    limits: {
        fileSize: 5000000000
    }
});

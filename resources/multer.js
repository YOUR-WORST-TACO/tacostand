const multer = require('@koa/multer');
const sentencer = require('sentencer');
const path = require('path');

const store_manager = multer.diskStorage({
    destination: (req, file, back) => {
        switch (req.path) {
            case "/once":
                back(null, './tacos/supreme');
                break;
            case "/wrap":
                back(null, './tacos/wrap');
                break;
            default:
                back(null, './tacos');
        }
    },
    filename: (req, file, back) => {
        let file_name = sentencer.make("{{adjective}}-{{noun}}") + path.extname(file.originalname);

        if (req.path === "/wrap") {
            file_name += ".wrap";
        }

        back(null, file_name);
    }
});

module.exports = multer({
    storage: store_manager,
    limits: {
        fileSize: 5000000000
    }
});

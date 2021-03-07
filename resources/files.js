const config = require('../config');
const path = require('path');
const fs = require('fs');

let check_interval = config.upload.cleanup * 60 * 1000

const __root = path.dirname(require.main.filename);

const storage = {
    standard: path.join(__root, "tacos"),
    once: path.join(__root, "tacos", "supreme"),
    wrap: path.join(__root, "tacos", "wrap")
}

if (!fs.existsSync(storage.standard)) {
    fs.mkdirSync(storage.standard);
}

if (!fs.existsSync(storage.once)) {
    fs.mkdirSync(storage.once);
}

if (!fs.existsSync(storage.wrap)) {
    fs.mkdirSync(storage.wrap);
}

async function file_cleanup(folder, age) {
    const files = await fs.promises.readdir(folder);
    for (const file of files) {

        const info = await fs.promises.stat(path.join(folder, file))
        if (info.isFile()) {
            let check_date = new Date();
            check_date.setDate(check_date.getDate() - age);

            if (info.mtime < check_date) {
                fs.rmSync(path.join(folder, file));
                console.log("File Expired:", file, ":", info.mtime);
            }
        }
    }
}

module.exports.storage = storage;

module.exports.init = () => {
    setInterval(async () => {
        try {
            await file_cleanup(storage.standard, config.upload.age.default);
            await file_cleanup(storage.once, config.upload.age.once);
            await file_cleanup(storage.wrap, config.upload.age.wrap);
        } catch (e) {
            console.log("Error:", e);
        }
    }, check_interval);
}

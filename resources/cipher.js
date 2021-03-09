const crypto = require('crypto');

const config = require('../config');

module.exports.generatePassword = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

module.exports.encrypt = (text, password) => {
    try {
        const salt = crypto.randomBytes(64);
        const iv = crypto.randomBytes(16);

        let derived_key = crypto.pbkdf2Sync(password, salt, 50000, 32, 'sha512');

        const cipher = crypto.createCipheriv(config.cipher.algorithm, derived_key, iv);
        let encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        let buffer = Buffer.concat([salt, iv, encrypted]);

        return {
            password: password,
            content: buffer
        };
    } catch (e) {
        console.log(e);
    }
}

module.exports.decrypt = (data, password) => {
    //const decipher = crypto.createDecipheriv(config.cipher.algorithm, config.cipher.key, Buffer.from(key, 'hex'));
    //return Buffer.concat([decipher.update(text), decipher.final()]);
    try {
        const salt = data.slice(0, 64);
        const iv = data.slice(64, 80);
        //console.log(salt);
        //console.log(iv);
        const text = data.slice(80, data.length);

        let derived_key = crypto.pbkdf2Sync(password, salt, 50000, 32, 'sha512');

        //console.log(derived_key);
        const decipher = crypto.createDecipheriv(config.cipher.algorithm, derived_key, iv);
        let decrypted = Buffer.concat([decipher.update(text), decipher.final()]);

        return decrypted;
    } catch (e) {
        console.log(e);
    }

}

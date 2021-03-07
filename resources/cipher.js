const crypto = require('crypto');

const config = require('../config');

module.exports.encrypt = (text) => {
    const key = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(config.cipher.algorithm, config.cipher.key, key);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        key: key.toString('hex'),
        content: encrypted
    };
}

module.exports.decrypt = (text, key) => {
    const decipher = crypto.createDecipheriv(config.cipher.algorithm, config.cipher.key, Buffer.from(key, 'hex'));
    return Buffer.concat([decipher.update(text), decipher.final()]);
}

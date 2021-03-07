const dotenv = require('dotenv');

dotenv.config();

const config = {
    server: {
        port: process.env.TACOCART_PORT || 3000,
        host: process.env.TACOCART_HOST || 'localhost',
        secure: process.env.TACOCART_SECURE || false
    },
    upload: {
        age: {
            normal: process.env.TACOCART_MAX_AGE || 7,
            once: process.env.TACOCART_MAX_AGE_ONCE || 1,
            wrap: process.env.TACOCART_MAX_AGE_WRAP || 1
        },
        cleanup: process.env.TACOCART_MINUTES || 30
    },
    cipher: {
        key: process.env.TACOCART_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        algorithm: process.env.TACOCART_ALGORITHM || 'aes-256-ctr'
    }
}

module.exports = config;

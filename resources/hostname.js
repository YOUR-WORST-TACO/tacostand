const config = require('../config');

module.exports = () => {
    let port = config.server.port !== 443 || config.server.port !== 80 ? ":" + config.server.port : "";
    let prefix = config.server.secure ? "https://" : "http://";
    return prefix + config.server.host + port + "/";
}

// get location file
const path = require('path');

class WhandlerClass {
    root = "";
    locationConfig = "";
    configuration = "";
    locationHandlers = "";
    handlers = [];

    constructor(socket) {
        this.socket = socket;
        this.init();
    }

    init() {
        this.loadDirs();
        this.intializeOnMessage();
        this.loadHandlers();
    }

    loadDirs() {
        this.root = this.getRootDirectory();
        this.locationConfig = this.getRootConfig();
        this.configuration = this.getConfiguration();
        this.locationHandlers = this.getLocationHandlers();
    }

    getRootDirectory() {
        return path.join(__dirname, "../../");
    }

    getRootConfig() {
        return path.join(this.root, "whandler.json");
    }

    getConfiguration() {
        return require(this.locationConfig);
    }

    getLocationHandlers() {
        return path.join(this.locationConfig, this.configuration["source"]);
    }

    loadHandlers() {
        const dir = this.locationHandlers;

        const fs = require('fs');

        fs.readdir(dir, (err, files) => {
            files.forEach(file => {
                const handler = require(path.join(dir, file));
                this.handlers.push(handler);
            });
        });
    }

    intializeOnMessage() {

    }
}

function Whandler(socket) {
    return new WhandlerClass(socket);
}

module.exports = Whandler;
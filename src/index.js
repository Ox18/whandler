const path = require('path');

class WhandlerFiles {
    root = "";
    locationConfig = "";
    configuration = "";
    locationHandlers = "";
    handlers = [];

    constructor() {
        this.init();
    }

    init() {
        this.loadDirs();
        this.loadHandlers();
    }

    loadDirs() {
        this.root = this.getRootDirectory();
        this.locationConfig = this.getRootConfig();
        this.configuration = this.getConfiguration();
        this.locationHandlers = this.getLocationHandlers();
    }

    getRootDirectory() {
        return path.join(__dirname, "../../../");
    }

    getRootConfig() {
        return path.join(this.root, "whandler.json");
    }

    getConfiguration() {
        return require(this.locationConfig);
    }

    getLocationHandlers() {
        return path.join(this.locationConfig, "../", this.configuration["source"]);
    }

    loadHandlers() {
        const dir = this.locationHandlers;

        const fs = require('fs');

        fs.readdir(dir, (_err, files) => {
            files?.forEach(file => {
                const routeFile = path.join(dir, file);
                const handler = require(routeFile);
                this.handlers.push(handler);
            });
        });
    }

    getHandler(opcode) {
        const handler = this.handlers.find(handler => handler.opcodes.includes(opcode));

        if (!handler) {
            throw new Error("Handler << " + opcode + " >> not found");
        }

        return handler;
    }
}

module.exports = function () {
    const files = new WhandlerFiles();

    return {
        handle: function (opcode, data) {
            const handler = files.getHandler(opcode);
            handler.handler(data);
        }
    }
}
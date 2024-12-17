const {randomUUID} = require("crypto");

class Client {
    constructor(options) {
        this.ws = options.ws;
        this.username = options.username;
        this.sessionId = options.sessionId || randomUUID();
        this.sendOptions();
    }

    sendOptions(){
        this.send({
            type: 'options',
            sessionId: this.sessionId,  
                data:{
                    username: this.username
                }
        });
    }

    send(data) {
        this.ws.send(JSON.stringify(data));
    }
}

module.exports = { Client };
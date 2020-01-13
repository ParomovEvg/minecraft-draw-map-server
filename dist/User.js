"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryTypes_1 = require("./queryTypes");
class User {
    constructor(id, clientSocket, srcSocket) {
        this.id = id;
        this.clientSocket = clientSocket;
        this.srcSocket = srcSocket;
        this.closed = false;
        this.clientSocket.on("message", data => {
            console.log("clientOnMessage");
            if (typeof data !== "string")
                return;
            const info = JSON.parse(data);
            if (info.type && info.body) {
                this.onClientMess(info.type, info.body);
            }
        });
        this.srcSocket.on("message", data => {
            console.log("srcOnMessage");
            if (typeof data !== "string")
                return;
            const info = JSON.parse(data);
            if (info.type && info.body) {
                this.onSrcMess(info.type, info.body);
            }
        });
        this.clientSend(queryTypes_1.CLIENT_FROM_SERVER.USER_CREATED, id);
    }
    close() {
        this.closed = true;
        this.clientSend(queryTypes_1.CLIENT_FROM_SERVER.USER_CLOSED, this.id);
    }
    onClientMess(type, body) {
        if (this.closed)
            return;
        if (type === queryTypes_1.CLIENT_FROM_CLIENT.SET_PARAMS) {
            this.onSetParams(body);
        }
    }
    onSrcMess(type, body) {
        if (this.closed)
            return;
        if (type === queryTypes_1.SRC_FROM_CLIENT.SET_IMG) {
            this.onSetImg(body);
        }
    }
    onSetParams(body) {
        this.srcSend(queryTypes_1.SRC_FROM_SERVER.SET_PARAMS, body);
    }
    onSetImg(body) {
        this.clientSend(queryTypes_1.CLIENT_FROM_SERVER.SET_IMG, body);
    }
    clientSend(type, body) {
        this.clientSocket.send(JSON.stringify({
            type,
            body,
        }));
    }
    srcSend(type, body) {
        this.srcSocket.send(JSON.stringify({
            type,
            body,
        }));
    }
}
exports.default = User;

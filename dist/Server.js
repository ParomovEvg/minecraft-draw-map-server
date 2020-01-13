"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const url = __importStar(require("url"));
const queryTypes_1 = require("./queryTypes");
const UserList_1 = __importDefault(require("./UserList"));
class Server {
    constructor() {
        this.userList = new UserList_1.default();
        this.ids = new Set();
        this.pass = {};
        this.onConnectionClient = (ws) => {
            ws.on("message", data => {
                if (typeof data !== "string")
                    return;
                const info = JSON.parse(data);
                if (info.type !== queryTypes_1.CLIENT_FROM_CLIENT.CREATE)
                    return;
                if (info.type &&
                    info.id &&
                    info.pass &&
                    !this.ids.has(info.id)) {
                    const id = info.id;
                    this.ids.add(id);
                    this.pass[id] = info.pass;
                    this.userList.setClientSocket(id, ws);
                    ws.on('close', () => {
                        this.ids.delete(id);
                        delete this.pass[id];
                        this.userList.deleteClientSocket(id);
                    });
                }
                else {
                    ws.send(JSON.stringify({
                        type: queryTypes_1.CLIENT_FROM_SERVER.AUTH_ERROR,
                    }));
                }
            });
        };
        this.onConnectionSrc = (ws) => {
            ws.on("message", data => {
                console.log(data);
                if (typeof data !== "string")
                    return;
                const info = JSON.parse(data);
                if (info.type !== queryTypes_1.SRC_FROM_CLIENT.CREATE)
                    return;
                if (!(info.id &&
                    info.pass &&
                    info.type)) {
                    ws.send(JSON.stringify({
                        type: queryTypes_1.SRC_FROM_SERVER.AUTH_ERROR
                    }));
                }
                else if (!this.ids.has(info.id)) {
                    ws.send(JSON.stringify({
                        type: queryTypes_1.SRC_FROM_SERVER.AUTH_NOT_YET
                    }));
                }
                else if (this.pass[info.id] !== info.pass) {
                    ws.send(JSON.stringify({
                        type: queryTypes_1.SRC_FROM_SERVER.AUTH_BAD_PASS
                    }));
                }
                else {
                    const id = info.id;
                    this.userList.setSrcSocket(id, ws);
                    ws.on("close", code => {
                        this.userList.deleteSrcSocket(id);
                    });
                }
            });
        };
    }
    listen(port) {
        const server = http.createServer();
        const client = new WebSocket.Server({ noServer: true });
        const src = new WebSocket.Server({ noServer: true });
        client.on('connection', this.onConnectionClient);
        src.on('connection', this.onConnectionSrc);
        server.on('upgrade', function upgrade(request, socket, head) {
            const pathname = url.parse(request.url).pathname;
            if (pathname === '/client/') {
                client.handleUpgrade(request, socket, head, function done(ws) {
                    client.emit('connection', ws, request);
                });
            }
            else if (pathname === '/src/') {
                src.handleUpgrade(request, socket, head, function done(ws) {
                    src.emit('connection', ws, request);
                });
            }
            else {
                socket.destroy();
            }
        });
        server.listen(port, () => {
            console.log(port);
        });
    }
}
exports.Server = Server;

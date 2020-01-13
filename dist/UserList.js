"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class UserList {
    constructor() {
        this.userList = {};
    }
    setClientSocket(id, clientSocket) {
        if (!this.userList[id]) {
            this.userList[id] = {};
        }
        this.userList[id].clientSocket = clientSocket;
        this.createUser(id);
    }
    setSrcSocket(id, srcSocket) {
        if (!this.userList[id]) {
            this.userList[id] = {};
        }
        this.userList[id].srcSocket = srcSocket;
        this.createUser(id);
    }
    deleteClientSocket(id) {
        delete this.userList[id].clientSocket;
        if (this.userList[id].user) {
            // @ts-ignore
            this.userList[id].user.close();
        }
    }
    deleteSrcSocket(id) {
        delete this.userList[id].srcSocket;
        if (this.userList[id].user) {
            // @ts-ignore
            this.userList[id].user.close();
        }
    }
    createUser(id) {
        console.log(this);
        if (this.userList[id].clientSocket &&
            this.userList[id].srcSocket) {
            // @ts-ignore
            this.userList[id].user = new User_1.default(id, 
            // @ts-ignore
            this.userList[id].clientSocket, this.userList[id].srcSocket);
        }
    }
}
exports.default = UserList;

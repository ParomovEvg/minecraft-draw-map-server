"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server");
const { PORT = 4000 } = process.env;
const server = new Server_1.Server();
server.listen(PORT);

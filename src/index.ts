import {Server} from "./Server";

const {
    PORT = 4000
} = process.env;

const server = new Server();

server.listen(<number>PORT);
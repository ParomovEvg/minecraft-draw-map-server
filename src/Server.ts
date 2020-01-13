import * as http from 'http'
import * as WebSocket from "ws";
import * as url from 'url'
import {
    CLIENT_FROM_CLIENT,
    CLIENT_FROM_SERVER,
    ICreateClientQuery,
    ICreateSrcQuery,
    SRC_FROM_CLIENT, SRC_FROM_SERVER
} from "./queryTypes";
import UserList from "./UserList";



export class Server {

    private userList: UserList = new UserList();
    private ids: Set<string> = new Set<string>();
    private pass: {[id:string]:string} = {};

    public listen(port:number){
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
            } else if (pathname === '/src/') {
                src.handleUpgrade(request, socket, head, function done(ws) {
                    src.emit('connection', ws, request);
                });
            } else {
                socket.destroy();
            }
        });

        server.listen(port, ()=>{
            console.log(port)
        });

    }

    onConnectionClient = (ws:WebSocket) => {
        ws.on("message", data => {
            if (typeof data !== "string") return;

            const info:ICreateClientQuery = JSON.parse(data);

            if( info.type !== CLIENT_FROM_CLIENT.CREATE ) return;

            if(
                info.type &&
                info.id &&
                info.pass &&
                !this.ids.has(info.id)
            ){

                const id = info.id;
                this.ids.add(id);
                this.pass[id] = info.pass;
                this.userList.setClientSocket(id, ws);

                ws.on('close', () => {
                    this.ids.delete(id);
                    delete this.pass[id];
                    this.userList.deleteClientSocket(id);
                })




            } else {
                ws.send(JSON.stringify({
                    type:CLIENT_FROM_SERVER.AUTH_ERROR,
                }))
            }

        })
    };

    onConnectionSrc = (ws:WebSocket) => {
        ws.on("message", data => {
            console.log(data);
            if (typeof data !== "string") return;
            const info:ICreateSrcQuery = JSON.parse(data);

            if( info.type !== SRC_FROM_CLIENT.CREATE ) return;

            if (
                !(
                    info.id &&
                    info.pass &&
                    info.type
                )
            ) {
                ws.send(JSON.stringify({
                    type: SRC_FROM_SERVER.AUTH_ERROR
                }))
            } else if (!this.ids.has(info.id)) {
                ws.send(JSON.stringify({
                    type: SRC_FROM_SERVER.AUTH_NOT_YET
                }))
            } else if (this.pass[info.id] !== info.pass) {
                ws.send(JSON.stringify({
                    type: SRC_FROM_SERVER.AUTH_BAD_PASS
                }))
            } else {
                const id = info.id;
                this.userList.setSrcSocket(id, ws);
                ws.on("close", code => {
                    this.userList.deleteSrcSocket(id);
                })


            }
        })
    }

}
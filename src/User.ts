import * as WebSocket from "ws";
import {
    CLIENT_FROM_CLIENT,
    CLIENT_FROM_SERVER,
    IFromClientQuery,
    IFromSrcQuery,
    SRC_FROM_CLIENT,
    SRC_FROM_SERVER
} from "./queryTypes";

export default class User {
    private closed = false;

    constructor(
        private id: string,
        private readonly clientSocket: WebSocket,
        private readonly srcSocket: WebSocket,
    ){
        this.clientSocket.on("message", data => {
            console.log("clientOnMessage")
            if (typeof data !== "string") return;
            const info: IFromClientQuery = <IFromClientQuery>JSON.parse(data);
            if(info.type && info.body){
                this.onClientMess(info.type, info.body)
            }
        });

        this.srcSocket.on("message", data => {
            console.log("srcOnMessage")
            if (typeof data !== "string") return;
            const info: IFromSrcQuery = <IFromSrcQuery>JSON.parse(data);
            if(info.type && info.body){
                this.onSrcMess(info.type, info.body)
            }
        });

        this.clientSend(CLIENT_FROM_SERVER.USER_CREATED, id);
    }

    close(){
        this.closed = true;
        this.clientSend(CLIENT_FROM_SERVER.USER_CLOSED, this.id);
    }

    private onClientMess(type:CLIENT_FROM_CLIENT, body:any){
        if(this.closed) return;
        if(type === CLIENT_FROM_CLIENT.SET_PARAMS){
            this.onSetParams(body);
        }
    }


    private onSrcMess(type:SRC_FROM_CLIENT, body:any){
        if(this.closed) return;
        if(type === SRC_FROM_CLIENT.SET_IMG){
            this.onSetImg(body);
        }
    }

    private onSetParams(body:any){
        this.srcSend(SRC_FROM_SERVER.SET_PARAMS, body);
    }

    private onSetImg(body:any){
        this.clientSend(CLIENT_FROM_SERVER.SET_IMG, body);
    }

    private clientSend(type:CLIENT_FROM_SERVER, body:any){
        this.clientSocket.send(JSON.stringify({
            type,
            body,
        }))
    }

    private srcSend(type:SRC_FROM_SERVER, body:any){
        this.srcSocket.send(JSON.stringify({
            type,
            body,
        }))
    }
}





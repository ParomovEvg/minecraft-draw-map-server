import * as WebSocket from "ws";
import User from "./User";

export default class UserList {

    private userList:{
        [id:string]:{
            clientSocket?: WebSocket ,
            srcSocket?: WebSocket ,
            user?: User
        }
    } = {};

    setClientSocket(id:string, clientSocket: WebSocket):void {
        if (!this.userList[id]) {
            this.userList[id] = {}
        }

        this.userList[id].clientSocket = clientSocket;
        this.createUser(id);
    }

    setSrcSocket(id:string, srcSocket: WebSocket):void {

        if (!this.userList[id]) {
            this.userList[id] = {};
        }

        this.userList[id].srcSocket = srcSocket;
        this.createUser(id);
    }

    deleteClientSocket(id:string):void{
       delete this.userList[id].clientSocket;
       if(this.userList[id].user) {
           // @ts-ignore
           this.userList[id].user.close();
       }

    }

    deleteSrcSocket(id:string):void{
        delete this.userList[id].srcSocket;
        if (this.userList[id].user) {
            // @ts-ignore
            this.userList[id].user.close();
        }
    }

    private createUser(id:string){
        console.log(this)
        if(
            this.userList[id].clientSocket &&
            this.userList[id].srcSocket
        ){
            // @ts-ignore
            this.userList[id].user = new User(
                id,
                // @ts-ignore
                this.userList[id].clientSocket,
                this.userList[id].srcSocket,
            )
        }
    }

}

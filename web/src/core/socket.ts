import {  Manager, Socket } from "socket.io-client";
import { generateUUID } from "./tools";


const webSocketUrl = "ws://localhost:3000"
// const webSocketUrl = "ws://101.42.33.99:3000"

type MessageType = "YummyConnect"|"createRoom"|"joinRoom"|"offer"

export class SocketCore {
  socket: Socket;
  constructor() {
    const manager = new Manager(webSocketUrl, {})
    this.socket = manager.socket('/room');
    this.online()
  }

  sendMessage(type:MessageType,data:Record<string,unknown>={}){
    this.socket.emit(type,{...data,user_id:sessionStorage.getItem('user_id')})
  }


  online(){
    let user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
      user_id = generateUUID();
      sessionStorage.setItem('user_id', user_id);
    }
    this.sendMessage('YummyConnect')
  }
  on(message:string,callback:(r:unknown)=>void){
    this.socket.on(message, (r) => {
      callback(r)
    })
    return this
  }
}

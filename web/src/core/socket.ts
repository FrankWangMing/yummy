import { io, Manager, Socket } from "socket.io-client";


const webSocketUrl = "ws://101.42.33.99:3000"

export class SocketCore {
  socket: Socket;
  constructor() {
    const manager = new Manager(webSocketUrl, {})
    this.socket = manager.socket('/room');


  }

}
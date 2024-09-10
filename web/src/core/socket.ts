import { io, Socket } from "socket.io-client";


export class SocketCore {
  socket: Socket;
  constructor() {
    this.socket = io();

  }

}
import { Manager, Socket } from "socket.io-client";
import { generateUUID, Tools } from "./tools";

const webSocketUrl = "ws://localhost:3000";
// const webSocketUrl = "ws://101.42.33.99:3000"

type MessageType =
  | "iceCandidate"
  | "YummyConnect"
  | "YummyDisConnect"
  | "createMeet"
  | "joinMeet"
  | "offer"
  | "call"
  | "answer";

export class SocketCore {
  socket: Socket;
  constructor() {
    const manager = new Manager(webSocketUrl, {});
    this.socket = manager.socket("/meet");
    this.socket.connect()
    this.socket.once("connect", () => {
      this.online();
    })
    this.socket.once("disconnect", () => {
      this.socket.connect()
    })
  }
  get id() {
    return this.socket.id
  }

  sendMessage(type: MessageType, data: Record<string, unknown> = {}): Socket {
    return this.socket.emit(type, {
      ...data,
      user_id: Tools.UserID()
    });
  }

  online() {
    let user_id = Tools.UserID()
    this.sendMessage("YummyConnect", {
      user_id,
      socket_id: this.id
    });
  }
  offline() {
    debugger
    let user_id = Tools.UserID()
    this.sendMessage("YummyDisConnect", {
      user_id,
      socket_id: this.id
    });
  }
  on(message: string, callback: (r: unknown) => void) {
    this.socket.on(message, (r) => {
      callback(r);
    });
    return this;
  }
}

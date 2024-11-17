import { Peer } from "./peer";

export class MessageChannel extends RTCDataChannel {

    constructor(peer: Peer) {
        super();
        console.log(peer)
    }

    send(data: unknown): void {
        super.send(JSON.stringify(data));
    }
}
import { MediaController } from "./medias";
import {  PeerMap } from "./peer";
import { SocketCore } from "./socket";

export class Core {
  public peerMap: PeerMap = new PeerMap()

  public socketCore: SocketCore = new SocketCore()

  public mediaController: MediaController = new MediaController()

  constructor() {

    console.log(this.peerMap.host)
    console.log(this.mediaController)

  }

  public create(){ }
}


export const core = new Core()
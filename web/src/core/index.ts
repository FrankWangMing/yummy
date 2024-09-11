import { MediaController } from "./medias";
import {  PeerController } from "./peer";
import { SocketCore } from "./socket";

export class Core {



  constructor(
    public peerController: PeerController,
    public mediaController: MediaController,
    public socketCore: SocketCore
  ) {}

  public create(){ }

  public online(){}


  createMeeting(){
    this.peerController.createHost()
    this.socketCore.sendMessage("createRoom")

  }

  joinMeeting(meet_id:string){
    this.socketCore.sendMessage("joinRoom",{
      meet_id
    })

  }

  joinRoom(){

  }

}

export const socketCore = new SocketCore()
export const mediaController: MediaController = new MediaController()
export const peerController: PeerController = new PeerController(socketCore,mediaController)
export const core = new Core(peerController,mediaController,socketCore)
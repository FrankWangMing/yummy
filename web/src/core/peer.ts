import { MediaController } from "./medias";
import { SocketCore } from "./socket";

const iceServer = { // stun 服务，如果要做到 NAT 穿透，还需要 turn 服务
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};
export class PeerController extends Map<string, Peer> {
  host: Peer
  configuration: RTCConfiguration = iceServer

  constructor(
    public socketCore: SocketCore,
    public mediaController: MediaController
  ) {
    super()
    socketCore.on("joinRoom",async (message:any)=>{
      console.log(message)
      if(message.offer && this.host){
        const peerConnection = this.host
        peerConnection.addEventListener('connectionstatechange', event => {
          console.log('Connection state changed: ', peerConnection.connectionState);
          if (peerConnection.connectionState === 'connected') {
              // Peers connected!
              console.log("Peers connected!")
          }
        });
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer))
        const answer = await this.host.createAnswer();
        await peerConnection.setLocalDescription(answer);
        // socketCore.sendMessage("answer",{'': answer});
        const localStream = await mediaController.getUserMedia()
        localStream.getTracks().forEach(track => {
          console.log("track",track)
          console.log(localStream);
          this.host.addTrack(track, localStream);
        });
        this.host.addEventListener("track",event=>{
          console.log("track",event)
        })


      }
    })

    // this.host?.addEventListener("track",event=>{
    //   const [remoteStream] = event.streams;
    //   console.log("track")
    //   const remoteVideo = document.createElement("remove");
    //   remoteVideo.srcObject = remoteStream;
    // })
  }

  createHost(){
    this.host = this.createPeer()
    return this.host
  }
  private createPeer(){
    return new Peer(this)
  }


}


export class Peer extends RTCPeerConnection {
  private offer!: RTCSessionDescription
  controller: PeerController;
  constructor(controller:PeerController) {
    super(controller.configuration)
    this.controller = controller
    this.createOffer().then(offer => {
      console.log(offer)
      this.offer = offer as RTCSessionDescription
      controller.socketCore.sendMessage("offer",this.sdp)
    })
  }
  get sdp() {
    return {sdp:this.offer.sdp}
  }


  setRemote(offer: RTCSessionDescription) {
    this.setRemoteDescription(offer)
  }
}


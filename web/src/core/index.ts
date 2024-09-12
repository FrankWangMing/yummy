import { ChatController } from "./chat";
import { MediaController } from "./medias";
import { SocketCore } from "./socket";

export class Core {



  constructor(
    public chatController: ChatController,
    public mediaController: MediaController,
    public socketCore: SocketCore,
  ) {
    socketCore.on("joinRoom",(message:unknown)=>{
      console.log(message)
      const {socket_id,meet_id} = message
      // this.
      // this.makeCall()
      console.log(socketCore.socket.id)
      console.log(socket_id)
      console.log(meet_id)
      this.chatController.create(message)
    })
    socketCore.on("createMeeting",(e)=>{
      console.log(e)
    })
    // socketCore.on("call",async (message:any)=>{
    //   const offer = message.offer
    //   const meet_id = message.meet_id
    //   if(offer){
    //     const peerConnection =  await this.peerController.createPeer()
    //     const localStream = await mediaController.getUserMedia()
    //     localStream.getTracks().forEach(track => {
    //       console.log("track",track)
    //       // console.log(localStream);
    //       peerConnection.addTrack(track, localStream);
    //     });
    //     // Listen for connectionstatechange on the local RTCPeerConnection
    //     peerConnection.addEventListener('connectionstatechange', event => {
    //       console.log(event)
    //       if (peerConnection.connectionState === 'connected') {
    //           // Peers connected!
    //       }
    //     });
    //     peerConnection.addEventListener("track",event=>{
    //       const [remoteStream] = event.streams;
    //       console.log("remoteStream track")
    //       const remoteVideo = document.createElement("remove");
    //       remoteVideo.srcObject = remoteStream;
    //     })









    //     await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

    //     const answer = await peerConnection.initAnswer()
    //     peerConnection.setLocalDescription(answer)

    //     console.log(peerConnection)
    //     // socketCore.sendMessage("answer",{'': answer});





    //     socketCore.sendMessage("answer",{meet_id,answer})
    //   }
    // })

  }

  createMeeting(){
    this.socketCore.sendMessage("createRoom")
  }

  async joinMeeting(meet_id:string){
    this.socketCore.sendMessage("joinRoom",{
      meet_id,
    })
  //   socketCore.on("answer",async (message:any)=>{
  //     console.log(message)
  //     console.log(peerConnection)
  //     const {meet_id,answer} = message.data
  //     const remoteDesc = new RTCSessionDescription(answer);
  //     await peerConnection.setRemoteDescription(remoteDesc);

  //   })
  //   socketCore.on('iceCandidate', async message => {
  //     console.log('iceCandidate', message);
  //     if (message.iceCandidate) {
  //         try {
  //             await peerConnection.addIceCandidate(message.iceCandidate);
  //         } catch (e) {
  //             console.error('Error adding received ice candidate', e);
  //         }
  //     }
  // });
  //   peerConnection.onicecandidate( event => {
  //     console.log('iceCandidate', event);
  //     if (event.candidate) {
  //       socketCore.sendMessage("iceCandidate",{'new-ice-candidate': event.candidate});
  //     }
  //   });

  }

  joinRoom(){

  }

}

export const socketCore = new SocketCore()
export const mediaController: MediaController = new MediaController()
export const chatController: ChatController = new ChatController(socketCore,mediaController)
export const core = new Core(chatController,mediaController,socketCore)
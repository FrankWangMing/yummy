import { SocketCore } from './socket.ts'
import { MediaController } from './medias.ts'
import { Chat } from './chat.ts'
import { socketCore } from './index.ts'
import { Api } from './http.ts'

export class Meet extends Map<string,Chat> {
  constructor(
    public api:Api,
    public socketCore: SocketCore,
    public mediaController: MediaController,
  ) {
    super()
    socketCore.on("createRoom", () => {
    })
    // this.socketCore.on("call",async (message:any)=>{
    //     console.log(message)
    //     const peerConnection = chat.remote
    //     await peerConnection.setRemoteDescription(new RTCSessionDescription(message.data.offer))
    //     const answer = await peerConnection.initAnswer()
    //     peerConnection.setLocalDescription(answer)
    //     this.socketCore.sendMessage("answer",{meet_id,answer})
    // })
    // this.socketCore.on("answer",async (message:any)=>{
    //     console.log(message)
    //     const peerConnection = chat.local
    //     const {meet_id,answer} = message.data
    //     const remoteDesc = new RTCSessionDescription(answer);
    //     await peerConnection.setRemoteDescription(remoteDesc);
    // })
    socketCore.on("joinRoom",(message:unknown)=>{
      const {socket_id,meet_id} = message
      // this.
      // this.makeCall()
      console.log(socketCore.socket.id)
      console.log(socket_id)
      console.log(meet_id)
      console.log(message)

      //有人加入，创建 chat
      // this.create(message)
    })
    socketCore.on("createMeeting",(e)=>{
      console.log(e)
    })

    socketCore.on("iceCandidate",(message:any)=>{
      console.log(message)
    })
    socketCore.on("call",(message:any)=>{
      console.log(message)
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

  async createMeeting(){
    // this.socketCore.sendMessage("createRoom")
    const r = await this.api.createMeet()
    console.log(r)

  }

  async joinMeeting(meet_id:string){
      const r = await this.api.joinMeet(meet_id)
      console.log(r)


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

  create(meet_id: string,user_id:string) {
    const chat = new Chat(this, meet_id, socketCore)
    console.log("create")
    this.set(user_id, chat)
  }
}


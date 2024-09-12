import { MediaController } from "./medias";
import { Peer } from "./peer";
import { SocketCore } from "./socket";

export class Chat {
    public remote:Peer
    public local:Peer

    constructor(
        public controller:ChatController,
        public meet_id:string,
        public socketCore: SocketCore,
    ){
        this.local = new Peer(this,"local"),
        this.remote = new Peer(this,"remote")
        this.init()
        this.local.call(this.remote).then(offer=>{

            console.log(socketCore)

        this.socket.sendMessage("call",{offer,meet_id:this.meet_id})

        })
    }
    async init(){
        console.log("init")
        this.local.init()
        this.remote.init()
        // this.controller.socketCore.on("call",async (message:any)=>{
        //     console.log(message)
        //     const offer = message.offer
        //     if(offer){
        //         const peerConnection =  await this.remote
        //         const localStream = await this.controller.mediaController.getUserMedia()
        //         localStream.getTracks().forEach(track => {
        //           console.log("track",track)
        //           // console.log(localStream);
        //           peerConnection.addTrack(track, localStream);
        //         });
        //         peerConnection.addEventListener('connectionstatechange', event => {
        //             console.log(event)
        //             if (peerConnection.connectionState === 'connected') {
        //                 // Peers connected!
        //             }
        //           });
        //           peerConnection.addEventListener("track",event=>{
        //             const [remoteStream] = event.streams;
        //             console.log("remoteStream track")
        //             const remoteVideo = document.createElement("remove");
        //             remoteVideo.srcObject = remoteStream;
        //           })
        //           this.remote.call(offer)
        //     }
        // })

    }
    get socket(){
        return this.controller.socketCore
    }


}


export class ChatController extends Map<string,Chat>{
    constructor(
    public socketCore: SocketCore,
    public mediaController: MediaController,
    ){
        super()
        socketCore.on("createRoom",()=>{})
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
    }
    create(data:any){
        const chat = new Chat(this,data.meet_id,this.socketCore)
        this.set(data.socket_id,chat)

    }
}
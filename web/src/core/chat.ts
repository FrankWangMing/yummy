import { Peer } from "./peer";
import { SocketCore } from "./socket";
import { Meet } from './meet.ts'

export class Chat {
    public remote:Peer
    public local:Peer

    constructor(
        public meet:Meet,
        public meet_id:string,
        public socketCore: SocketCore,
    ){
        this.local = new Peer(this,"local"),
        this.remote = new Peer(this,"remote")
        this.init()
        console.log(socketCore)
        socketCore.on("call",(message)=>{
            console.log(message)
        })
        this.local.call(this.remote).then(offer=>{

            console.log(socketCore)


            socketCore.sendMessage("call",{offer,meet_id})

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

}

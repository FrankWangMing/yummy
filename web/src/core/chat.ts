import { Peer } from "./peer";
import { SocketCore } from "./socket";
import { Meet } from './meet.ts'
import { Tools } from "./tools.ts";

export class Chat {
    public local: Peer | undefined
    public list: any = []

    constructor(
        public meet: Meet,
        public meet_id: string,
        public socketCore: SocketCore,
    ) {
        this.socketCore.on("iceCandidate",this.handleCandidate.bind(this))
        this.socketCore.on("call", this.handleOffer.bind(this))
        this.socketCore.on("answer", this.handleAnswer.bind(this))
    }

    async makeCall (user_id) {
        const check  =  Object.is(user_id,Tools.UserID())
        if(!check) {
            const peerConnection= new Peer(this);
            await peerConnection.init()
            const offer = await peerConnection.offer()
            await peerConnection.setLocalDescription(offer)
            this.socketCore.sendMessage("call", { offer:{type: 'offer', sdp: offer.sdp}, meet_id: this.meet_id })
            this.local  = peerConnection
        }
    }

    async handleOffer({offer}){
        console.log(offer)
        console.log(this)
        // if(isUndefined(this.local)){

        // }

        const peerConnection = new Peer(this)
        await peerConnection.init()
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.answer();
        this.socketCore.sendMessage("answer", { meet_id:this.meet_id, answer : {type: 'answer', sdp: answer.sdp} })
        peerConnection.setLocalDescription(answer)
        this.local = peerConnection
    }
    async handleAnswer({answer}) {
        console.log(answer)
        console.log(this.local)
        if(!this.local){
            return
        }
        await this.local.setRemoteDescription(answer);
    }

    async handleCandidate({candidate}) {
        if (!this.local) {
          console.error('no peerconnection');
          return;
        }
        if (!candidate) {
          await this.local.addIceCandidate(null);
        } else {
            if(this.local.remoteDescription){
                await this.local.addIceCandidate(candidate);
            }
        }
      }
}

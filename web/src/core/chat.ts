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
        public other_user_id: string
    ) {
        this.socketCore.on("iceCandidate", this.handleCandidate.bind(this))
        this.socketCore.on("call", this.handleOffer.bind(this))
        this.socketCore.on("answer", this.handleAnswer.bind(this))
    }

    async makeCall(user_id) {
        const check = Object.is(user_id, Tools.UserID())
        if (!check) {
            const peerConnection = new Peer(this);
            await peerConnection.init()
            const offer = await peerConnection.offer()
            await peerConnection.setLocalDescription(offer)
            this.local = peerConnection
            console.log("makeCall")
            console.log(this.local)
            this.socketCore.sendToUserMessage(this.other_user_id, "call", { offer: { type: 'offer', sdp: offer.sdp }, meet_id: this.meet_id })
        }
    }

    async handleOffer({ offer }) {
        console.log(offer)
        console.log(this.local)


        const peerConnection = new Peer(this)
        await peerConnection.init()
        if (!this.local) {
            this.local = peerConnection
        }
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.answer();
        peerConnection.setLocalDescription(answer)
        this.socketCore.sendToUserMessage(this.other_user_id, "answer", { meet_id: this.meet_id, answer: { type: 'answer', sdp: answer.sdp } })
    }
    async handleAnswer({ answer }) {
        console.log(answer)
        console.log(this.local)
        if (!this.local) {
            return
        }
        await this.local.setRemoteDescription(new RTCSessionDescription(answer));
    }

    async handleCandidate({ candidate }) {
        // console.log("handleCandidate", this.local)
        // console.log("handleCandidate", candidate)
        if (!this.local) {
            console.error('no peerconnection');
            return;
        }
        // if (!candidate) {
        //     await this.local.addIceCandidate(null);
        // } else {
        if (this.local.remoteDescription) {
            await this.local.addIceCandidate(new RTCIceCandidate(candidate));
        }
        // }
    }
}

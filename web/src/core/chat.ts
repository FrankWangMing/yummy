import { Peer } from "./peer";
import { SocketCore } from "./socket";
import { MeetController } from './meet.ts'
import { Tools } from "./tools.ts";
import { Video } from "./video.ts";
import { videoController } from "./index.ts";
import { isEqual } from "lodash";
import { autorun } from "mobx";

export class Chat {
    private _local: Peer | undefined
    public list: any = []
    public video: Video
    constructor(
        public meet: MeetController,
        public meet_id: string,
        public socketCore: SocketCore,
        public other_user_id: string
    ) {
        this.socketCore.on("iceCandidate", this.handleCandidate.bind(this))
        this.socketCore.on("call", this.handleOffer.bind(this))
        this.socketCore.on("answer", this.handleAnswer.bind(this))
        this.video = videoController.create(other_user_id)
    }
    async sendMessage(data) {
        console.log(this.local)
        this.local.channel.send(data)
    }
    set local(value) {
        this._local = value
    }
    get local() {
        if (!this._local) {
            return undefined
        }
        return this._local
    }

    async makeCall(user_id) {
        const check = Object.is(user_id, Tools.UserID())
        if (!check) {
            console.error("not same user")
            const peerConnection = new Peer(this);
            await peerConnection.init()
            const offer = await peerConnection.offer()
            await peerConnection.setLocalDescription(offer)
            this.local = peerConnection
            console.log("makeCall")
            this.socketCore.sendToUserMessage(this.other_user_id, "call", { offer: { type: 'offer', sdp: offer.sdp }, meet_id: this.meet_id })
        }
    }

    async handleOffer({ offer }) {
        const peerConnection = new Peer(this)

        peerConnection.ondatachannel = (event) => {
            console.log("datachannel open");
            var channel = event.channel;
            channel.onopen = function (event) {
                channel.send("Hi back!");
            };
            channel.onmessage = function (event) {
                console.log(event.data);
            };
            peerConnection.channel = channel
        };
        await peerConnection.init()
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.answer();
        peerConnection.setLocalDescription(answer)
        if (!this.local) {
            this.local = peerConnection
        }
        this.socketCore.sendToUserMessage(this.other_user_id, "answer", { meet_id: this.meet_id, answer: { type: 'answer', sdp: answer.sdp } })
    }
    answerData: any[] = []
    async pushAnswer(answer) {
        this.answerData.push(answer)
        if (!this.local) {
            return
        }
        while (this.answerData.length) {
            const answer = this.answerData.shift()
            if (!isEqual(this.local.signalingState, 'stable')) {
                this.local.setRemoteDescription(new RTCSessionDescription(answer));
            }
        }

    }

    async handleAnswer({ answer }) {
        await this.pushAnswer(answer)

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


    /*
        远程静音
    */
    silence() {
        console.log(this.local.getRemoteAudio())
        this.local.getRemoteAudio().track.enabled = false
    }
}


import { Peer } from "./peer";
import { SocketCore } from "./socket";
import { Meet } from './meet.ts'
import { get, isNull } from "lodash";

export class Chat {
    public local: Peer
    public list: any = []

    constructor(
        public meet: Meet,
        public meet_id: string,
        public socketCore: SocketCore,
    ) {
        // this.remote = new Peer(this, "remote")

        let pendingIceCandidates: any = []

        this.socketCore.on("iceCandidate", async (message: any) => {
            if (!isNull(get(message, "candidate", null))) {
                if (this.local.remoteDescription) {
                    await this.local.addIceCandidate(new RTCIceCandidate(message.candidate)).catch((error) => {
                        console.error('Failed to add ICE candidate:', error);
                    });
                } else {
                    pendingIceCandidates.push(message.candidate); // 暂时保存候选者
                }
            }
        })
        this.socketCore.on("call", async (message: any) => {
            this.local = new Peer(this)
            await this.local.init()

            const peerConnection = this.local
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer))
            if (pendingIceCandidates.length > 0) {
                for (const candidate of pendingIceCandidates) {
                    await peerConnection.addIceCandidate(candidate);
                }
                pendingIceCandidates = []; // 清空候选者队列
            }
            const answer = await peerConnection.initAnswer()
            peerConnection.setLocalDescription(answer)
            this.socketCore.sendMessage("answer", { meet_id, answer })
        })
        this.socketCore.on("answer", async (message: any) => {
            console.log(message)
            const peerConnection = this.local
            const { meet_id, answer } = message
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        })

    }

    async call() {
        this.local = new Peer(this)
        await this.local.init()
        const offer = await this.local.call()
        this.socketCore.sendMessage("call", { offer, meet_id: this.meet_id })
    }


}

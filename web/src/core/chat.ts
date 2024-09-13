import { Peer } from "./peer";
import { SocketCore } from "./socket";
import { Meet } from './meet.ts'
import { get, isNull } from "lodash";

export class Chat {
    public remote: Peer
    public local: Peer
    public list: any = []

    constructor(
        public meet: Meet,
        public meet_id: string,
        public socketCore: SocketCore,
    ) {
        this.local = new Peer(this, "local")
        this.remote = new Peer(this, "remote")
        this.local.onicecandidate = (event) => {
            // console.log("onicecandidate", event)
            if (event.candidate) {
                this.socketCore.sendMessage("iceCandidate", {
                    candidate: event.candidate,
                })
            }
        }
        let pendingIceCandidates: any = []

        this.socketCore.on("iceCandidate", async (message: any) => {
            if (!isNull(get(message, "candidate", null))) {
                if (this.local.remoteDescription) {
                    await this.remote.addIceCandidate(new RTCIceCandidate(message.candidate)).catch((error) => {
                        console.error('Failed to add ICE candidate:', error);
                    });
                } else {
                    pendingIceCandidates.push(message.candidate); // 暂时保存候选者
                }
            }
        })

        this.init().then(() => {
            this.local.call(this.remote).then(async (offer) => {
                this.socketCore.on("call", async (message: any) => {
                    const peerConnection = this.remote
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer))
                    const answer = await peerConnection.initAnswer()
                    peerConnection.setLocalDescription(answer)
                    this.socketCore.sendMessage("answer", { meet_id, answer })
                })
                this.socketCore.on("answer", async (message: any) => {
                    console.log(message)
                    const peerConnection = this.local
                    const { meet_id, answer } = message
                    const remoteDesc = new RTCSessionDescription(answer);
                    await peerConnection.setRemoteDescription(remoteDesc);
                    if (pendingIceCandidates.length > 0) {
                        for (const candidate of pendingIceCandidates) {
                            await peerConnection.addIceCandidate(candidate);
                        }
                        pendingIceCandidates = []; // 清空候选者队列
                    }
                })




                // socketCore.on("answer", async (message: any) => {
                //     console.log(message)
                //     const peerConnection = this.local
                //     const { meet_id, answer } = message.data
                //     const remoteDesc = new RTCSessionDescription(answer);
                //     await peerConnection.setRemoteDescription(remoteDesc);
                // })
                // socketCore.on("call", async (message) => {
                //     console.log(message)
                //     const offer = message.offer
                //     if (offer) {
                //         console.log("offer", offer)
                //         const peerConnection = await this.remote
                //         const localStream = await this.meet.mediaController.getUserMedia()
                //         localStream.getTracks().forEach(track => {
                //             console.log("track", track)
                //             // console.log(localStream);
                //             peerConnection.addTrack(track, localStream);
                //         });
                //         peerConnection.addEventListener('connectionstatechange', event => {
                //             console.log(event)
                //             if (peerConnection.connectionState === 'connected') {
                //                 // Peers connected!
                //             }
                //         });
                //         peerConnection.addEventListener("track", event => {
                //             const [remoteStream] = event.streams;
                //             console.log("remoteStream track")
                //             const remoteVideo = document.createElement("remove");
                //             remoteVideo.srcObject = remoteStream;
                //         })
                //        socketCore.sendMessage("answer", { meet_id, answer })
                //     }
                // })
                socketCore.sendMessage("call", { offer, meet_id })
            })
        })

    }
    async init() {
        console.log("init")
        await this.local.init()
        await this.remote.init()
    }

}

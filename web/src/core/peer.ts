import { Chat } from "./chat";
import { VideoController } from "./videoDom";



export class Peer extends RTCPeerConnection {
  public videoController: VideoController

  constructor(
    public chat: Chat,
  ) {
    super(
      {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302'
          }
        ],
        iceTransportPolicy: 'all'
      }
    )
    this.videoController = chat.meet.videoController
  }


  async init() {

    this.onicecandidate = (event) => {
      if (event.candidate) {
        this.chat.socketCore.sendToUserMessage(this.chat.other_user_id, "iceCandidate", {
          candidate: event.candidate,
          // candidate: event.candidate.candidate,
          // sdpMid :event.candidate.sdpMid,
          // sdpMLineIndex:event.candidate.sdpMLineIndex,
        })
      }
    }
    const localStream = await this.chat.meet.mediaController.getUserMedia()

    this.onsignalingstatechange = async (event) => {
      console.log("onsignalingstatechange", event)
      console.log(this.signalingState)
    }
    this.oniceconnectionstatechange = async (event) => {
      console.log("ICE  状态:", this.iceConnectionState);
    }
    this.onconnectionstatechange = () => {
      console.log("连接状态:", this.connectionState);
    };

    this.ontrack = (event) => {
      // console.log("ontrack", event)
      // !.setState({
      //   srcObject:event.streams[0]
      // })
      // console.log(
      //   this.videoController.get("remote")
      // )
      // console.log(document.getElementById("remoteVideo"))
      // document.getElementById("remoteVideo")!.srcObject = event.streams[0];
    }
    localStream.getTracks().forEach(track => {
      // console.log("track", track)
      this.addTrack(track, localStream);
    });

  }

  async initOffer() {
    const offer = await super.createOffer()
    return offer
  }

  async answer() {
    const answer = await super.createAnswer()
    return answer
  }

  async offer() {
    // localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
    const offer = await this.initOffer()
    return offer
  }

}


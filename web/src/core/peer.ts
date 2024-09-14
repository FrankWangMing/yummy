import { Chat } from "./chat";



export class Peer extends RTCPeerConnection {
  constructor(
    public chat: Chat,
  ) {
    super({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ],
      iceTransportPolicy: 'all'
    })
    this.init()
  }


  async init() {

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
      console.log('track', event)
    }
    this.onicecandidate = (event) => {
      // console.log("onicecandidate", event)
      if (event.candidate) {
        this.chat.socketCore.sendMessage("iceCandidate", {
          candidate: event.candidate,
        })
      }
    }

    const localStream = await this.chat.meet.mediaController.getUserMedia()
    localStream.getTracks().forEach(track => {
      // console.log("track", track)
      // console.log(localStream);
      this.addTrack(track, localStream);
    });

  }

  async initOffer() {
    const offer = await super.createOffer()
    return offer
  }

  async initAnswer() {
    const answer = await super.createAnswer()
    return answer
  }


  setRemote(offer: RTCSessionDescriptionInit) {
    this.setRemoteDescription(offer)
  }

  async call() {
    // localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
    const offer = await this.initOffer()
    await this.setLocalDescription(offer)
    return offer
  }


  answer() {

  }
}


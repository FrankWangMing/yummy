import { Chat } from "./chat";

const iceServer = { // stun 服务，如果要做到 NAT 穿透，还需要 turn 服务
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

type PeerType = "local" | "remote"
export class Peer extends RTCPeerConnection {
  type: PeerType = 'local'
  public _offer!: RTCSessionDescriptionInit
  public _answer!: RTCSessionDescriptionInit
  constructor(
    public chat: Chat,
    type: PeerType
  ) {
    super(iceServer)
    this.type = type
    this.init()
  }
  get sdp() {
    return { sdp: this._offer.sdp }
  }

  init() {
    this.onsignalingstatechange = async (event) => {
      console.log("onsignalingstatechange", event)
      console.log(this.signalingState)
    }
    this.oniceconnectionstatechange = async (event) => {
      console.log("oniceconnectionstatechange", event)
    }
    this.onconnectionstatechange = async (event) => {
      console.log("onconnectionstatechange", event)
    }
    this.onicecandidate = async (event) => {
      console.log("onicecandidate", event)
      console.log(event)
      let otherPeer: Peer
      if (this.type == 'local') {
        otherPeer = this.chat.remote
        otherPeer.addIceCandidate(event.candidate)
      }
      if (this.type == 'remote') {
        otherPeer = this.chat.local
        otherPeer.addIceCandidate(event.candidate)
      }
    }

    this.ontrack = (event) => {
      console.log('track', event)
    }

  }

  async initOffer() {
    const offer = await super.createOffer()
    this._offer = offer
    return offer
  }

  async initAnswer() {
    const answer = await super.createAnswer()
    this._answer = answer
    return answer
  }


  setRemote(offer: RTCSessionDescriptionInit) {
    this.setRemoteDescription(offer)
  }

  async call(peer: Peer) {
    // localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
    const offer = await this.initOffer()
    await this.setLocalDescription(offer)
    return offer
  }


  answer() {

  }
}


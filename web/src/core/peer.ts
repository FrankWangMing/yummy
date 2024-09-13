import { get, isNull } from "lodash";
import { Chat } from "./chat";



type PeerType = "local" | "remote"
export class Peer extends RTCPeerConnection {
  type: PeerType = 'local'
  public _offer!: RTCSessionDescriptionInit
  public _answer!: RTCSessionDescriptionInit
  constructor(
    public chat: Chat,
    type: PeerType
  ) {
    super({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ],
      // iceTransportPolicy: 'all'
    })
    this.type = type
    this.init()
  }
  get sdp() {
    return { sdp: this._offer.sdp }
  }

  async init() {

    this.onsignalingstatechange = async (event) => {
      console.log("onsignalingstatechange", event)
      console.log(this.signalingState)
    }
    this.oniceconnectionstatechange = async (event) => {
      console.log(this.type)
      console.log("ICE  状态:", this.iceConnectionState);
    }
    this.onconnectionstatechange = () => {
      console.log(this.type)
      console.log("连接状态:", this.connectionState);
    };

    this.ontrack = (event) => {
      console.log('track', event)
    }

    if (this.type == 'local') {
      const localStream = await this.chat.meet.mediaController.getUserMedia()
      localStream.getTracks().forEach(track => {
        // console.log("track", track)
        // console.log(localStream);
        this.addTrack(track, localStream);
      });

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


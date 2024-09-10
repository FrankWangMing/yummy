export class PeerMap extends Map<string, Peer> {
  host: Peer
  constructor() {
    super()
    this.host = new Peer()
  }


}


const iceServer = { // stun 服务，如果要做到 NAT 穿透，还需要 turn 服务
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

export class Peer extends RTCPeerConnection {
  private offer!: RTCSessionDescription
  constructor(configuration: RTCConfiguration = iceServer) {
    super(configuration)
    this.createOffer().then(offer => {
      console.log(offer)
      this.offer = offer as RTCSessionDescription
    })
  }
  get sdp() {
    return this.offer.sdp
  }


  setRemote(offer: RTCSessionDescription) {
    this.setRemoteDescription(offer)
  }
}


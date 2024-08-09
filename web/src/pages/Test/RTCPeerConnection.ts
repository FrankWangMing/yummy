export class RTCPeer{
    pc:RTCPeerConnection
    constructor(){
        const config = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        const pc:RTCPeerConnection =  new RTCPeerConnection(config)

        // send any ice candidates to the other peer
        pc.onicecandidate = function (evt) {
            signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
        };

        // once remote stream arrives, show it in the remote video element
        pc.onaddstream = function (evt) {
            remoteView.src = URL.createObjectURL(evt.stream);
        };


        this.pc = pc
    }
    offer(){
        return this.pc.createOffer()
    }
    async aa(){
      return  this.pc.setLocalDescription(await this.offer())
    }
}
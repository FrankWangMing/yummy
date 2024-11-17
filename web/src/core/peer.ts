import { MessageChannel } from "./MessageChannel";
import { Chat } from "./chat";
import { VideoController } from "./video";



export class Peer extends RTCPeerConnection {
  public videoController: VideoController
  public channel: MessageChannel

  constructor(
    public chat: Chat,
  ) {
    super(
      {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302'
          },
          // {
          //   urls: 'stun:stun1.l.google.com:19302'
          // },
          // {
          //   urls: "turn:relay1.expressturn.com:3478?transport=udp",
          //   username: "efSLJX5OXVYEN2KJCE",
          //   credential: "D303uQfv1q2sNfNI"
          // },
        ],
        iceTransportPolicy: 'all',
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
      if (this.connectionState == "connected") {
        console.log("连接成功")

        this.channel = this.createDataChannel("chat")
        console.log("channel", this.channel)
        this.channel.onopen = () => {
          console.log("datachannel open");
          const obj = {
            message: "msg",
            timestamp: new Date(),
          };
          setInterval(() => {
            console.log("KK", obj)
            console.log(this.channel)
            this.channel.send(JSON.stringify(obj));
          }, 1000);
        };

        this.channel.onclose = () => console.log("DataChannel is closed");
        this.channel.onerror = (error) => console.error("DataChannel error:", error);

      }
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
      this.chat.video.setSrcObject(event.streams[0])
      console.log("ontrack", event)
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


  getRemoteAudio() {
    return this.getReceivers().find(r => r.track.kind == "audio")
  }

}


import { SocketCore } from './socket.ts'
import { MediaController } from './medias.ts'
import { Chat } from './chat.ts'
import { socketCore } from './index.ts'
import { Api } from './http.ts'
import { VideoController } from './videoDom.tsx'
import { forEach, isEqual } from 'lodash'
import { Tools } from './tools.ts'

export class Meet extends Map<string, Chat> {
  meet_id!: string
  constructor(
    public api: Api,
    public socketCore: SocketCore,
    public mediaController: MediaController,
    public videoController: VideoController,
  ) {
    super()

    socketCore.on("joinMeet", (message: any) => {
      console.log(message)
      const other_user_id = message.user_id

      //有人加入，创建 chat
      const chat = this.create(this.meet_id, other_user_id)
      chat.makeCall(message.user_id)

    })
  }

  async createMeeting() {
    // this.socketCore.sendMessage("createMeet")
    const { meet_id } = await this.api.createMeet()
    this.meet_id = meet_id
    console.log(meet_id)
  }
  async reconnectMeeting() {
    if (socketCore.socket.disconnected) {
      await this.socketCore.socket.connect()
      const result = await this.api.reconnectMeet()
      console.log("meet_id", result)
      // await this.joinMeeting(meet_id)
    }
  }

  async leaveMeeting() {
    console.log(this.meet_id)
    if (socketCore.socket.connected) {
      await this.api.leaveMeet(this.meet_id)
      await this.socketCore.socket.disconnect()
    }

  }

  async joinMeeting(meet_id: string) {
    this.meet_id = meet_id
    const { user_ids } = await this.api.joinMeet(meet_id)
    console.log(user_ids)
    forEach(user_ids, user_id => {
      if (!isEqual(user_id, Tools.UserID())) {
        console.log(user_id)
        console.log(Tools.UserID())
        console.log(isEqual(user_id, Tools.UserID()))
        this.create(meet_id, user_id)
        this.socketCore.sendToUserMessage(user_id, 'joinMeet', {
          meet_id,
        })
      }
    })
    // this.create(this.meet_id, other_user_id)



    // console.log(r)
    // const { user_ids } = r





    //   socketCore.on("answer",async (message:any)=>{
    //     console.log(message)
    //     console.log(peerConnection)
    //     const {meet_id,answer} = message.data
    //     const remoteDesc = new RTCSessionDescription(answer);
    //     await peerConnection.setRemoteDescription(remoteDesc);

    //   })
    //   socketCore.on('iceCandidate', async message => {
    //     console.log('iceCandidate', message);
    //     if (message.iceCandidate) {
    //         try {
    //             await peerConnection.addIceCandidate(message.iceCandidate);
    //         } catch (e) {
    //             console.error('Error adding received ice candidate', e);
    //         }
    //     }
    // });
    //   peerConnection.onicecandidate( event => {
    //     console.log('iceCandidate', event);
    //     if (event.candidate) {
    //       socketCore.sendMessage("iceCandidate",{'new-ice-candidate': event.candidate});
    //     }
    //   });

  }

  create(meet_id: string, other_user_id: string) {
    console.log("new Chart")
    const chat = new Chat(this, meet_id, socketCore, other_user_id)
    this.set(other_user_id, chat)
    return chat
  }
}


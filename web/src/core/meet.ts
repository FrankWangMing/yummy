import { SocketCore } from './socket.ts'
import { MediaController } from './medias.ts'
import { Chat } from './chat.ts'
import { socketCore } from './index.ts'
import { Api } from './http.ts'
import { filter, forEach } from 'lodash'
import { Tools } from './tools.ts'

export class Meet extends Map<string, Chat> {
  meet_id!: string
  constructor(
    public api: Api,
    public socketCore: SocketCore,
    public mediaController: MediaController,
  ) {
    super()

    socketCore.on("joinMeet", (message: any) => {
      console.log(message)

      //有人加入，创建 chat
      const chat = this.create(this.meet_id, message.user_id)
      chat.call()
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
    const r = await this.api.joinMeet(meet_id)
    console.log(r)
    const { user_ids } = r
    forEach(user_ids, i => {
      console.log(user_ids)
      this.create(meet_id, i)
    })




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

  create(meet_id: string, user_id: string) {
    const chat = new Chat(this, meet_id, socketCore)
    console.log("create")
    this.set(user_id, chat)
    return chat
  }
}


import { SocketCore } from './socket.ts'
import { MediaController } from './medias.ts'
import { Chat } from './chat.ts'
import { socketCore } from './index.ts'
import { Api } from './http.ts'
import { VideoController } from './video.ts'
import { Tools } from './tools.ts'
import { forEach, isEqual } from 'lodash-es';
import { makeAutoObservable } from 'mobx'
export class MeetController {
  map: Map<string, Chat> = new Map()
  meet_id!: string
  constructor(
    public api: Api,
    public socketCore: SocketCore,
    public mediaController: MediaController,
    public videoController: VideoController,
  ) {
    makeAutoObservable(this)
    socketCore.on("joinMeet", async (message: any) => {
      console.log(message)
      const other_user_id = message.user_id
      //有人加入，创建 chat
      const chat = this.create(this.meet_id, other_user_id)
      await chat.makeCall(message.user_id)
      console.log(this.data)
    })
  }
  get data() {
    return Array.from(this.map.values());
  }
  _activeChat: Chat

  get activeChat() {
    if (!this._activeChat) {
      this._activeChat = this.data[0]
    }
    return this._activeChat
  }
  set activeChat(value: Chat) {
    this._activeChat = value
  }

  /* 创建会议 */
  async createMeeting() {
    // this.socketCore.sendMessage("createMeet")
    const { meet_id } = await this.api.createMeet()
    this.meet_id = meet_id
    return meet_id
  }

  /* 进入会议 */
  async loadMeeting(meetId: string) {
    const { user_ids } = await this.api.joinMeet(meetId)
    this.meet_id = meetId
    const ownerVideo = this.videoController.create(Tools.UserID())
    ownerVideo.setSrcObject(await this.mediaController.getUserMedia())
    forEach(user_ids, user_id => {
      if (!isEqual(user_id, Tools.UserID())) {
        this.create(meetId, user_id)
        this.socketCore.sendToUserMessage(user_id, 'joinMeet', {
          meet_id: meetId,
        })
      }
    })
    return user_ids
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
    forEach(this.data, (chat, key) => {
      chat.local.close()
    })
    if (socketCore.socket.connected) {
      await this.api.leaveMeet(this.meet_id)
      await this.socketCore.socket.disconnect()
    }
  }

  async joinMeeting(meet_id: string) {
    this.meet_id = meet_id
    const { user_ids } = await this.api.joinMeet(meet_id)

    forEach(user_ids, user_id => {
      if (!isEqual(user_id, Tools.UserID())) {
        this.create(meet_id, user_id)
        this.socketCore.sendToUserMessage(user_id, 'joinMeet', {
          meet_id,
        })
      }
    })
  }

  create(meet_id: string, other_user_id: string) {
    console.log("new Chart")
    const chat = new Chat(this, meet_id, socketCore, other_user_id)
    this.map.set(other_user_id, chat)
    return chat
  }
}


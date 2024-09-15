import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { MeetService } from './meet.service'
import { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service'
import { isEqual } from 'lodash'

@WebSocketGateway({
  namespace: 'meet',
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class MeetGateway {
  @WebSocketServer() server: Server

  constructor(
    private readonly meetService: MeetService,
    private readonly userService: UserService,
  ) {
  }



  @SubscribeMessage('reconnectMeet')
  reconnectMeet(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    console.log(data)
  }

  @SubscribeMessage('joinMeet')
  async join(@MessageBody() data, @ConnectedSocket() socket: Socket) {

    const { meet_id, user_id, other_user_id } = data

    socket.join(meet_id)

    const { socket_id } = await this.userService.findOne({ user_id: other_user_id });

    try {
      const response = await socket.to(socket_id).emitWithAck('joinMeet', {
        name: 'joinMeet',
        meet_id,
        user_id,
      })
      console.log(response)
    } catch (err) {
      console.log(err)
      // the client did not acknowledge the event in the given delay
    }

    // // socket.emit("joinMeet",{name:'join',socket_id:socket.id})
    // // return this.meetService.findAll()
    // const event = 'call'
    // return { event, data: { offer, meet_id } }
  }

}

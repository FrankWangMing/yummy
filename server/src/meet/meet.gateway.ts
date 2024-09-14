import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { MeetService } from './meet.service'
import { Server, Socket } from 'socket.io'
import { UserService } from '../user/user.service'

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
  join(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    // socket.leave()
    // socket.to(data)
    console.log(data)
    const { meet_id, user_id } = data
    // socket.to(meet_id).emit('joinMeet',{name:'join',socket_id:socket.id})

    socket.join(meet_id)

    socket
      .to(meet_id)
      .emit('joinMeet', {
        name: 'joinMeet',
        meet_id,
        user_id,
        socket_id: socket.id
      })
    // // socket.emit("joinMeet",{name:'join',socket_id:socket.id})
    // // return this.meetService.findAll()
    // const event = 'call'
    // return { event, data: { offer, meet_id } }
  }

}

import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { RoomService } from './room.service'
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { Room } from './schemas/room.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@WebSocketGateway({
  namespace: 'room',
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class RoomGateway {
  @WebSocketServer() server: Server

  constructor(
    private readonly roomService: RoomService,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>
  ) {
  }

  @SubscribeMessage('createRoom')
  create(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    console.log(data)
    return this.roomService.create(data)
  }

  @SubscribeMessage('joinRoom')
  join(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    // socket.leave()
    // socket.to(data)
    console.log(data)
    const { meet_id,user_id } = data
    // socket.to(meet_id).emit('joinRoom',{name:'join',socket_id:socket.id})

    socket.join(meet_id)

    socket
      .to(meet_id)
      .emit('joinRoom', {
        name: 'joinRoom',
        meet_id,
        user_id,
        socket_id: socket.id
      })
    // // socket.emit("joinRoom",{name:'join',socket_id:socket.id})
    // // return this.roomService.findAll()
    // const event = 'call'
    // return { event, data: { offer, meet_id } }
  }

  @SubscribeMessage('findOneRoom')
  findOne(@MessageBody() id: number) {
    return this.roomService.findOne(id)
  }

  @SubscribeMessage('updateRoom')
  update(@MessageBody() updateRoomDto) {
    return this.roomService.update(updateRoomDto.id)
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() id: number) {
    return this.roomService.remove(id)
  }
}

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets'
import { RoomService } from './room.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { Room } from './schemas/room.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Server } from 'socket.io';
@WebSocketGateway({
  namespace: 'room',
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class RoomGateway {

  @WebSocketServer() server:Server

  constructor(
    private readonly roomService: RoomService,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>
  ) {



  }

  @SubscribeMessage('createRoom')
  create(
    @MessageBody() data,
    @ConnectedSocket() socket: Socket
  ) {

    const {user_id} = data
    const room_id = uuidv4()

    this.roomModel.create({room_id,user_id:[user_id]})
    socket.join(room_id)
    console.log(room_id)
    // return this.roomService.create(createRoomDto)
  }

  @SubscribeMessage('findAllRoom')
  findAll() {
    return this.roomService.findAll()
  }

  @SubscribeMessage('joinRoom')
  join(
    @MessageBody() data,
    @ConnectedSocket() socket: Socket) {
    // socket.leave()
    // socket.to(data)
    console.log(data)
    const {meet_id} =data
    // socket.to(meet_id).emit('joinRoom',{name:'join',socket_id:socket.id})



    socket.join(meet_id)
    socket.to(meet_id).emit("joinRoom",{name:'join',socket_id:socket.id,offer:{
        type: 'offer', // 或 'answer'
        sdp: socket.data.sdp
      }})
    // socket.emit("joinRoom",{name:'join',socket_id:socket.id})
    // return this.roomService.findAll()
  }

  @SubscribeMessage('findOneRoom')
  findOne(@MessageBody() id: number) {
    return this.roomService.findOne(id)
  }

  @SubscribeMessage('updateRoom')
  update(@MessageBody() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(updateRoomDto.id, updateRoomDto)
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() id: number) {
    return this.roomService.remove(id)
  }

  @SubscribeMessage('leaveRoom')
  leave(@MessageBody() id: number) {
    return this.roomService.remove(id)
  }
}

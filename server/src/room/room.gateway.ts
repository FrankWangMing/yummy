import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets'
import { RoomService } from './room.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(
  {
    namespace: 'room',
  }
)
export class RoomGateway {
constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('createRoom')
  create(@MessageBody() createRoomDto: CreateRoomDto,@ConnectedSocket() socket:Socket) {
    const room_id =uuidv4()

    socket.join(room_id)
    console.log(
      socket.rooms
    )
    return this.roomService.create(createRoomDto)
  }

  @SubscribeMessage('findAllRoom')
  findAll() {
    return this.roomService.findAll()
  }

  @SubscribeMessage('joinRoom',)
  join(@ConnectedSocket() socket:Socket) {
    // socket.leave()
    return this.roomService.findAll()
  }

  @SubscribeMessage('findOneRoom')
  findOne(@MessageBody() id: number) {
    return this.roomService.findOne(id)
  }

  @SubscribeMessage('updateRoom')
  update(@MessageBody() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(updateRoomDto.id, updateRoomDto)
  }

  @SubscribeMessage('removeRoom')
  remove(@MessageBody() id: number) {
    return this.roomService.remove(id)
  }

  @SubscribeMessage('leaveRoom')
  leave(@MessageBody() id: number) {

    return this.roomService.remove(id)
  }
}

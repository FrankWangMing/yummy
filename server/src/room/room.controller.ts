import { Body, Controller, Get } from '@nestjs/common'
import { RoomService } from './room.service'
import { CreateRoomDto } from './dto/create-room.dto'

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('create')
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    console.log(createRoomDto)
  }
}

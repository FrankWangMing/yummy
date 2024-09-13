import { Body, Controller, Get, Post } from '@nestjs/common'
import { RoomService } from './room.service'

@Controller('meet')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('create')
  createRoom(@Body() createRoomDto) {
    console.log(createRoomDto)
    console.log("createRoom")
    return this.roomService.create(createRoomDto)
  }

  @Post('join')
  joinRoom(@Body() createRoomDto) {
    console.log(createRoomDto)
    console.log("joinRoom")
    return this.roomService.joinRoom(createRoomDto)
  }
}

import { Module } from '@nestjs/common'
import { RoomService } from './room.service'
import { RoomGateway } from './room.gateway'
import { RoomController } from './room.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Room, RoomSchema } from './schemas/room.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])
  ],
  providers: [RoomGateway, RoomService],
  controllers: [RoomController]
})
export class RoomModule {}

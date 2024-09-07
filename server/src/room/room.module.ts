import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { RoomController } from './room.controller';

@Module({
  providers: [RoomGateway, RoomService],
  controllers: [RoomController],
})
export class RoomModule {}

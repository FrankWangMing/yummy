import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway {
  constructor( ) {}

  @SubscribeMessage('connect')
  create(@MessageBody() createRoomDto) {
  }

}

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsResponse, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Inject } from '@nestjs/common'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'


@WebSocketGateway(
  {
    namespace: 'room',
  }
)
export class AppGateway implements OnGatewayInit ,OnGatewayConnection,OnGatewayDisconnect   {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,) {

  }


  afterInit(socket:Socket) {
    socket.on('connect', (r) => {
      console.log(r.id)
      this.handleConnection(socket.client)
    })
  }
  handleConnection(client: any, ...args: any[]): any {
    console.log("JKKLJK")
  }

  handleDisconnect(client: any): any {
  }
  @SubscribeMessage('YummyConnect')
  create(@MessageBody() id: any, @ConnectedSocket() client: Socket) {
    // this.client.emit("events",{name:client.id})
    console.log(client.id)
  }

  @SubscribeMessage('test')
  update(@MessageBody() id: any, @ConnectedSocket() client: Socket) {
    console.log(id)
    console.log(client.id)
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    console.log(data)
    const event = 'events'
    return { event, data: 'JKJK' }
  }


}

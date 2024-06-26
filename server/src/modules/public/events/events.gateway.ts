import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server } from 'socket.io'

@WebSocketGateway(4000, {
  transports: ['websocket'],
  cors: {
    origin: '*'
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('test')
  test(@MessageBody() reqData: { name: string }) {
    // if (!reqData || !reqData.name) {
    //   throw BizException.create(ERR_REQ_FIELD_ERROR, 'data is empty')
    // }
    console.log(reqData)
    // console.log(JSON.stringify(reqData))
    return `hello,${JSON.stringify(reqData.name)}`
  }
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item }))
    )
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data
  }
}

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Inject } from '@nestjs/common'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { User } from './schemas/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { MeetService } from 'src/meet/meet.service'

@WebSocketGateway({
  namespace: 'meet',
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    public userService: UserService,
    public meetService: MeetService,
  ) { }


  afterInit(socket: Socket) {
    socket.on('connect', (r) => {
      this.handleConnection(socket)
    })

    socket.on('disconnect', (r) => {
      this.handleDisconnect(socket)
    })
  }
  handleConnection(client: Socket): any {
  }

  async handleDisconnect(client: Socket): Promise<any> {
    try {
      console.log(client.id)
      const r = await this.userService.findOne({
        socket_id: client.id
      })
      console.log("handleDisconnect", r)
      client.to(r.meet_id).except(client.id).emit('leaveMeet', {
        message: "掉线",
        user_id: r.user_id
      })
      await this.meetService.deleteUserIdInMeet(r.meet_id, r.user_id)
      console.log(r)
    } catch (error) {
      console.log(error)
    }

  }


  @SubscribeMessage('YummyConnect')
  async connect(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    // console.log("YummyConnect", data)
    let result = await this.userService.findOneAndUpdate(data.user_id, data)
    // console.log(result)
  }


  @SubscribeMessage('call')
  call(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log("call", data)
    client.to(data.meet_id).emit('call', data)

  }


  @SubscribeMessage('answer')
  answer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(data)
    const { meet_id } = data
    const event = 'answer'
    console.log(meet_id)
    client.to(meet_id).emit('answer', data)
  }

  @SubscribeMessage('iceCandidate')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    console.log(data)
    const event = 'events'
    return { event: "iceCandidate", data }
  }
}

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsResponse,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Inject } from '@nestjs/common'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { User } from './schemas/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { MeetService } from 'src/meet/meet.service'
import { get } from 'lodash'

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

  @WebSocketServer() server: Server

  afterInit(socket: Socket) {
    socket.on('connect', (r) => {
      this.handleConnection(socket)
    })

    socket.on('disconnect', (r) => {
      this.handleDisconnect(socket)
    })
  }
  handleConnection(socket: Socket): any {
  }

  async handleDisconnect(socket: Socket): Promise<any> {
    const r = await this.userService.findOne({
      socket_id: socket.id
    })
    const meet_id = get(r, 'meet_id', null)
    const user_id = get(r, 'user_id', null)
    if (meet_id && user_id) {
      try {
        socket.to(meet_id).except(socket.id).emit('leaveMeet', {
          message: "掉线",
          user_id
        });
        socket.leave(meet_id);
        this.meetService.deleteUserIdInMeet(r.meet_id, user_id)
        console.log(r)
      } catch (error) {
        console.log(error)
      }
    }
  }


  @SubscribeMessage('YummyConnect')
  async connect(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    // console.log("YummyConnect", data)
    let result = await this.userService.findOneAndUpdate(data.user_id, data)
    // console.log(result)
  }


  @SubscribeMessage('call')
  async call(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log("call", data)
    const { other_user_id } = data
    const { socket_id } = await this.userService.findOne({ user_id: other_user_id });
    socket.to(socket_id).emit('call', data)

  }


  @SubscribeMessage('answer')
  async answer(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    console.log(data)
    const { meet_id, other_user_id } = data
    const { socket_id } = await this.userService.findOne({ user_id: other_user_id });
    socket.to(socket_id).emit('answer', data)
  }

  @SubscribeMessage('iceCandidate')
  async handleEvent(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const { meet_id, other_user_id } = data
    const { socket_id } = await this.userService.findOne({ user_id: other_user_id });
    socket.to(socket_id).emit('iceCandidate', data)
  }
}

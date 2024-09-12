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

@WebSocketGateway({
  namespace: 'room',
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  afterInit(socket: Socket) {
    // socket.on('connect', (r) => {
    //   this.handleConnection(socket.client)
    // })
    socket.on('disconnect', (r) => {
      console.log(r)
      this.handleDisconnect(socket)
    })
  }
  handleConnection(client: any, ...args: any[]): any {}

  handleDisconnect(client: Socket): any {
    console.log(client.rooms)
    console.log('disconnect')
  }

  @SubscribeMessage('YummyConnect')
  create(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // this.client.emit("events",{name:client.id})
    let { user_id } = data
    this.userModel.deleteMany()
    this.userModel
      .findOneAndUpdate(
        { user_id },
        { $set: { socket_id: client.id } },
        { new: true, upsert: true }
      )
      .then((r) => {
        console.log(r)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  @SubscribeMessage('offer')
  offer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // this.client.emit("events",{name:client.id})
    let { user_id } = data
    this.userModel.deleteMany()
    this.userModel
      .findOneAndUpdate(
        { user_id },
        { $set: { socket_id: client.id } },
        { new: true, upsert: true }
      )
      .then((r) => {
        console.log(r)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  @SubscribeMessage('call')
  call(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // console.log('offer', message)
    const { user_id,meet_id, offer } = data
    console.log(meet_id)
    client.data.offer = offer
    this.userModel
      .findOneAndUpdate(
        { user_id },
        { $set: { socket_id: client.id, offer } },
        { new: true, upsert: true }
      )
    client.to(meet_id).emit('call', { data: data })
  }

  @SubscribeMessage('answer')
  answer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(data)
    const { meet_id } = data
    const event = 'answer'
    console.log(meet_id)
    client.to(meet_id).emit('answer', { event, data: data })
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    console.log(data)
    const event = 'events'
    return { event, data: 'JKJK' }
  }
}

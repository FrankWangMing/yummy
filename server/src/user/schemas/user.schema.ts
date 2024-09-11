import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop()
  user_id: string

  @Prop()
  socket_id: string

  @Prop()
  sdp: string

  @Prop()
  room_id: string
}

export const UserSchema = SchemaFactory.createForClass(User)

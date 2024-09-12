import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop()
  user_id: string

  @Prop()
  socket_id: string

  @Prop({ type: MongooseSchema.Types.Mixed })
  offer: Record<string, any>

  @Prop()
  room_id: string
}

export const UserSchema = SchemaFactory.createForClass(User)

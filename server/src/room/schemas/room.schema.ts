import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type RoomDocument = HydratedDocument<Room>

@Schema()
export class Room {
  @Prop()
  user_id: string[]

  @Prop()
  room_id: string
}

export const RoomSchema = SchemaFactory.createForClass(Room)

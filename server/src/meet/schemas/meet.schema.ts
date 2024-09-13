import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MeetDocument = HydratedDocument<Meet>

@Schema()
export class Meet {
  @Prop()
  user_ids: string[]

  @Prop()
  meet_id: string

  @Prop()
  owner_id: string

}

export const MeetSchema = SchemaFactory.createForClass(Meet)

import { PartialType } from '@nestjs/mapped-types'
import { CreateMeetDto } from './create-meet.dto'

export class UpdateMeetDto extends PartialType(CreateMeetDto) {
  id: number
}

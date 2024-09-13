import { Module } from '@nestjs/common'
import { MeetService } from './meet.service'
import { MeetGateway } from './meet.gateway'
import { MeetController } from './meet.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Meet, MeetSchema } from './schemas/meet.schema'
import { User, UserSchema } from '../user/schemas/user.schema'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meet.name, schema: MeetSchema }, { name: User.name, schema: UserSchema }])
  ],
  providers: [MeetGateway, MeetService, UserService],
  controllers: [MeetController]
})
export class MeetModule { }

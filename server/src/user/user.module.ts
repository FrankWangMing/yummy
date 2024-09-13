import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema } from './schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { UserGateway } from './user.gateway'
import { Meet, MeetSchema } from 'src/meet/schemas/meet.schema'
import { MeetService } from 'src/meet/meet.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meet.name, schema: MeetSchema }, { name: User.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService, MeetService, UserGateway]
})
export class UserModule { }

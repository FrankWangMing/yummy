import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schema'
import { Model } from 'mongoose'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
  }

}

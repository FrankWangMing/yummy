import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { UserEntity } from 'src/common/decorators/user.decorator'
import { AuthGuard } from 'src/common/guard/AuthGuard'
import { LoginInput } from 'src/dto/users/login.input'
import { AdminUsersService } from 'src/modules/public/user/admin.service'

@Controller('admin')
export class UserController {
  constructor(private readonly admin: AdminUsersService) {}

  @Post('create')
  async create() {
    return await this.admin.createUser({
      phone: '123',
      password: 'ddd',
      username: 'test'
    })
  }

  @Post('login')
  async login(@Body() params: LoginInput) {
    console.log(params)
    const { type } = params
    if (type == 'mobile') {
      return false
    }
    if (type == 'account') {
      return await this.admin.login(params.username, params.password)
    }
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async user(@UserEntity() user) {
    console.log(user)
    return user
    // return await this.admin.login(params.phone, params.password)
  }
}

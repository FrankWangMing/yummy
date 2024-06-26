import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { SignupInput } from 'src/dto/users/signup.input'
import { WholesalerUsersService } from 'src/modules/public/user/wholesaler.service'
import { UserEntity } from 'src/common/decorators/user.decorator'
import { AuthGuard } from 'src/common/guard/AuthGuard'

@Controller('wholesaler')
export class UserController {
  constructor(private readonly auth: WholesalerUsersService) {}

  @Post('create')
  async create(@Body() params: SignupInput) {
    console.log(params)
    return await this.auth.createUser({
      phone: params.phone,
      username: params.username,
      password: params.password,
      userImg: params.userImg
    })
  }

  @Post('login')
  async login(@Body() params) {
    return await this.auth.login(params.phone, params.password)
  }
  @Get('user')
  @UseGuards(AuthGuard)
  async user(@UserEntity() user) {
    return user
    // return await this.admin.login(params.phone, params.password)
  }
}

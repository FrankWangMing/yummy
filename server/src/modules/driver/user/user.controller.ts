import { Body, Controller, Post } from '@nestjs/common'
import { LoginInput } from 'src/dto/users/login.input'
import { SignupInput } from 'src/dto/users/signup.input'
import { DriverUsersService } from 'src/modules/public/user/driver.service'

@Controller('driver')
export class UserController {
  constructor(private readonly auth: DriverUsersService) {}

  @Post('create')
  async create(@Body() params: SignupInput) {
    console.log(params)
    return await this.auth.createUser({
      phone: params.phone,
      username: params.username,
      password: params.password
    })
  }

  @Post('login')
  async login(@Body() params: LoginInput) {
    return await this.auth.login(params.phone, params.password)
  }
}

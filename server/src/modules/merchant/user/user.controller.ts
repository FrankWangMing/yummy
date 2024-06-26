import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { SignupInput } from 'src/dto/users/signup.input'
import { LoginInput } from 'src/dto/users/login.input'
import { MerchantUsersService } from 'src/modules/public/user/merchant.service'
import { UserEntity } from 'src/common/decorators/user.decorator'
import { AuthGuard } from 'src/common/guard/AuthGuard'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { MinioService } from 'src/modules/public/minio/minio.service'
import { randomUUID } from 'crypto'
import { isNull } from 'lodash'
import { ShopService } from 'src/services/shop/shop.service'

@Controller('merchant')
export class UserController {
  constructor(
    private readonly merchantUser: MerchantUsersService,
    private readonly shop: ShopService,
    private readonly minIO: MinioService
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('userImg'))
  async create(
    @Body() params: SignupInput,
    @UploadedFile() userImg: Express.Multer.File
  ) {
    console.log(userImg)

    const fileName = `${randomUUID()}-${Date.now()}.${userImg.originalname.split('.')[1]}`
    await this.minIO.uploadFile('data', fileName, userImg.buffer)
    return await this.merchantUser.createUser({
      phone: params.phone,
      username: params.username,
      password: params.password,
      userImg: fileName
    })
  }

  @Post('login')
  async login(@Body() params: LoginInput) {
    return await this.merchantUser.login(params.phone, params.password)
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async user(@UserEntity() user) {
    console.log(user)
    if (!isNull(user.userImg)) {
      user.userImg = await this.minIO.presignedGetObject('data', user.userImg)
    }
    return {
      ...user,
      ...(await this.merchantUser.getShopInfoByMerchantId(user.id))
    }
  }
}

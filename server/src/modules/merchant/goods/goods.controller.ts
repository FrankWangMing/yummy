import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { GoodsService } from 'src/services/goods/goods.service'
import { AuthGuard } from '../../../common/guard/AuthGuard'
import { CreateGoodsInput } from 'src/dto/goods/creategoods.input'
import { UserEntity } from 'src/common/decorators/user.decorator'
import { MerchantUsersService } from 'src/modules/public/user/merchant.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { MinioService } from 'src/modules/public/minio/minio.service'
import { randomUUID } from 'crypto'

@Controller('merchant/goods')
export class GoodsController {
  constructor(
    private readonly goods: GoodsService,
    private readonly user: MerchantUsersService,
    private readonly minIO: MinioService
  ) {}

  @Post('creategoods')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainGoodsImg', maxCount: 1 },
      { name: 'goodsImg', maxCount: 5 }
    ])
  )
  async create(
    @UserEntity() user,
    @UploadedFiles()
    files: {
      mainGoodsImg?: Express.Multer.File
      goodsImg?: Express.Multer.File[]
    },
    @Body() params: CreateGoodsInput
  ) {
    const { goodsImg, mainGoodsImg } = files
    try {
      const goodsImgPath = goodsImg.map((i) => {
        const goodImgPath = `${user.shop.id}/goodsImg/${randomUUID()}.${i.originalname.split('.')[1]}`
        this.minIO.uploadFile('goods', goodImgPath, i.buffer)
        return goodImgPath
      })
      const mainGoodsImgPath = `${user.shop.id}/goodsImg/${randomUUID()}.${mainGoodsImg[0].originalname.split('.')[1]}`
      await this.minIO.uploadFile(
        'goods',
        mainGoodsImgPath,
        mainGoodsImg[0].buffer
      )
      const userInfo = await this.user.getShopInfoByMerchantId(user.id)
      return this.goods.createGoods({
        ...userInfo,
        ...params,
        goodsImgPath,
        mainGoodsImgPath
      })
    } catch (error) {
      console.log(error)
      return new BadRequestException(error)
    }
  }

  @Get('getgoods')
  @UseGuards(AuthGuard)
  getGoods(@UserEntity() user) {
    console.log(user)
    const merchantUserId = user.id
    return this.goods.getGoods({
      merchantUserId
    })
  }
}

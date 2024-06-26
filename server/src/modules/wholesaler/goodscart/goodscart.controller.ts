import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  UseGuards
} from '@nestjs/common'
import { UserEntity } from 'src/common/decorators/user.decorator'
import { AuthGuard } from 'src/common/guard/AuthGuard'
import { GoodsService } from 'src/services/goods/goods.service'
import { GoodsCartService } from 'src/services/goodsCart/goodscart.service'

@Controller('wholesaler/goodscart')
export class GoodsCartController {
  constructor(
    private readonly goodsCart: GoodsCartService,
    private readonly goods: GoodsService
  ) {}

  @Post('update')
  @UseGuards(AuthGuard)
  async updateGoodsCart(
    @UserEntity() user,
    @Body('goodsId', new ParseArrayPipe()) goodsId: string[]
  ) {}
  @Post('add')
  @UseGuards(AuthGuard)
  async addGoodsCart(@UserEntity() user, @Body('goodsId') goodsId: string) {
    console.log(goodsId)
    this.goodsCart.createGoodsToCart({
      wholesalerUserId: user.id,
      goodsId
    })
  }

  @Get('get')
  @UseGuards(AuthGuard)
  async getGoodsCart(@UserEntity() user) {
    const data = await this.goodsCart.getGoodsCart(user.id)
    console.log(data)

    return {
      ...data,
      goods: await this.goods.getGoods(data.goodsId)
    }
  }
}

import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  UseGuards
} from '@nestjs/common'
import { GoodsService } from 'src/services/goods/goods.service'
import { AuthGuard } from '../../../common/guard/AuthGuard'
import { UserEntity } from 'src/common/decorators/user.decorator'
import { ShopService } from 'src/services/shop/shop.service'
import { ShopApplicationService } from 'src/services/shop/shopApplication.service'

@Controller('merchant/shop')
export class ShopController {
  constructor(
    private readonly goods: GoodsService,
    private readonly shop: ShopService,
    private readonly shopApplication: ShopApplicationService
  ) {}

  @Post('edit')
  @UseGuards(AuthGuard)
  create(
    @UserEntity() user,
    @Body('goodsCategoryIds', ParseArrayPipe) goodsCategoryIds,
    @Body() params
  ) {
    const { id } = user['shop']

    return this.shop.updateShopInfo({ shopId: id, goodsCategoryIds })
  }

  @Post('apply')
  @UseGuards(AuthGuard)
  apply(@UserEntity() user, @Body() params) {
    return this.shopApplication.createApply(user, params)
  }
}

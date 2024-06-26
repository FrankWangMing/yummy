import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/guard/AuthGuard'
import { AdminUsersService } from 'src/modules/public/user/admin.service'
import { MerchantUsersService } from 'src/modules/public/user/merchant.service'
import { GoodsCategoryService } from 'src/services/goodsCategory/goodsCategory.service'
import { ShopService } from 'src/services/shop/shop.service'
import { ShopApplicationService } from 'src/services/shop/shopApplication.service'

@Controller('admin/merchant')
export class MerchantSetController {
  constructor(
    private readonly admin: AdminUsersService,
    private readonly merchant: MerchantUsersService,
    private readonly shop: ShopService,
    private readonly shopApplication: ShopApplicationService,
    private readonly goodsCategory: GoodsCategoryService
  ) {}

  @Post('create')
  async create() {
    return await this.admin.createUser({
      phone: '123',
      password: 'ddd',
      username: 'test'
    })
  }

  @Get('list')
  async merchantList() {
    // return await this.merchant.getAllMerchantUser()
    return await this.shop.getShops()
  }

  @Get('getShopLevel')
  @UseGuards(AuthGuard)
  getShopLevel(@Body() param) {
    this.goodsCategory.getGoodsCategory(param)
  }
  @Post('createShopLevel')
  @UseGuards(AuthGuard)
  createShopLevel(@Body() param) {
    this.goodsCategory.createGoodsCategory(param)
  }
  @Get('updateShopLevel')
  @UseGuards(AuthGuard)
  updateShopLevel(@Body() param) {
    this.goodsCategory.updateGoodsCategory(param)
  }
  @Get('delShopLevel')
  @UseGuards(AuthGuard)
  delShopLevel(@Body() param) {
    this.goodsCategory.delGoodsCategory(param)
  }
  //   @Get(':id')
  //   @UseGuards(AuthGuard)
  //   async merchantInfo(@UserEntity() user) {
  //     return user
  //     // return await this.admin.login(params.phone, params.password)
  //   }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ShopState } from '@prisma/client'
import { log } from 'console'
import { AuthGuard } from 'src/common/guard/AuthGuard'
import { AdminUsersService } from 'src/modules/public/user/admin.service'
import { MerchantUsersService } from 'src/modules/public/user/merchant.service'
import { ShopService } from 'src/services/shop/shop.service'
import { ShopApplicationService } from 'src/services/shop/shopApplication.service'
import { ShopLevelService } from 'src/services/shoplevel/shoplevel.service'

@Controller('admin/shop')
export class AdminShopController {
  constructor(
    private readonly admin: AdminUsersService,
    private readonly merchant: MerchantUsersService,
    private readonly shopLevel: ShopLevelService,
    private readonly shop: ShopService,
    private readonly shopApplication: ShopApplicationService
  ) {}
  @Get('getShopLevel')
  @UseGuards(AuthGuard)
  async shopLevelList() {
    return await this.shopLevel.getShopLevel()
  }

  @Post('createShopLevel')
  @UseGuards(AuthGuard)
  async createShopLevel(@Body() params) {
    return await this.shopLevel.createShopLevel(params)
  }

  @Get('applylist')
  // @UseGuards(AuthGuard)
  async merchantApply(@Body() params) {
    // return await this.merchant.getAllMerchantUser()
    return await this.shopApplication.applyList({
      applyState: params.appliyState
    })
  }

  @Post('dealapply')
  // @UseGuards(AuthGuard)
  async dealapply(
    @Body()
    params: {
      shopApplicationId: string
      shopState: ShopState
      description: string
    }
  ) {
    // return await this.merchant.getAllMerchantUser()

    const { shopApplicationId, shopState, description } = params
    try {
      return await this.shopApplication.dealWithApply({
        shopState,
        shopApplicationId,
        description
      })

      // if (result.appliyState == ShopState.onLine) {
      //   this.shop.createShop(result)
      // }
    } catch (error) {
      return error
    }
  }
}

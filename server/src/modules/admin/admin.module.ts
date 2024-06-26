import { Module } from '@nestjs/common'
import { PublicModule } from '../public/public.module'
import { UserController } from './user/user.controller'
import { GoodsCategoryController } from './goodsCategory/goodsCategory.controller'
import { MerchantSetController } from './merchantSet/merchantset.controller'
import { GoodsController } from './goods/goods.controller'
import { AdminShopController } from './merchantSet/shop.controller'

@Module({
  imports: [PublicModule],
  controllers: [
    UserController,
    GoodsController,
    MerchantSetController,
    GoodsCategoryController,
    AdminShopController
  ],
  providers: [],
  exports: [PublicModule]
})
export class AdminModule {}

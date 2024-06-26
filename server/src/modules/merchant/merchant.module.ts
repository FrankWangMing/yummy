import { Module } from '@nestjs/common'
import { UserController } from './user/user.controller'
import { PublicModule } from '../public/public.module'
import { GoodsController } from './goods/goods.controller'
import { ShopController } from './shop/shop.controller'

@Module({
  imports: [PublicModule],
  controllers: [UserController, GoodsController, ShopController],
  providers: [],
  exports: [PublicModule]
})
export class MerchantModule {}

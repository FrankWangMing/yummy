import { Module } from '@nestjs/common'
import { UserController } from './user/user.controller'
import { PublicModule } from '../public/public.module'
import { GoodsController } from './goods/goods.controller'
import { GoodsCartController } from './goodscart/goodscart.controller'
import { OrderController } from './order/order.controller'

@Module({
  imports: [PublicModule],
  controllers: [
    UserController,
    GoodsController,
    GoodsCartController,
    OrderController
  ],
  providers: [],
  exports: [PublicModule]
})
export class WholesalerModule {}

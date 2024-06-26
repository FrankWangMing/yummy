import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { GoodsService } from 'src/services/goods/goods.service'
import { GoodsCartService } from 'src/services/goodsCart/goodscart.service'
import { GoodsCategoryService } from 'src/services/goodsCategory/goodsCategory.service'
import { OrderService } from 'src/services/order/order.service'
import { ShopService } from 'src/services/shop/shop.service'
import { MinioModule } from '../modules/public/minio/minio.module'
import { ShopLevelService } from './shoplevel/shoplevel.service'
import { ShopApplicationService } from './shop/shopApplication.service'

@Module({
  imports: [MinioModule],
  providers: [
    PrismaClient,
    ShopService,
    OrderService,
    GoodsCartService,
    GoodsService,
    GoodsCategoryService,
    ShopLevelService,
    ShopApplicationService
  ],
  exports: [
    MinioModule,
    PrismaClient,
    ShopService,
    OrderService,
    GoodsCartService,
    GoodsService,
    GoodsCategoryService,
    ShopLevelService,
    ShopApplicationService
  ]
})
export class ServicesModule {}

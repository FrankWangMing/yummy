import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../../common/guard/AuthGuard'
import { ShopService } from 'src/services/shop/shop.service'

@Controller('merchant')
export class GoodsController {
  constructor(private readonly shop: ShopService) {}
}

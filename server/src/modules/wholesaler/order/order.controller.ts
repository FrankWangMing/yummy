import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { UserEntity } from 'src/common/decorators/user.decorator'
import { AuthGuard } from 'src/common/guard/AuthGuard'
import { GoodsService } from 'src/services/goods/goods.service'
import { OrderService } from 'src/services/order/order.service'

@Controller('wholesaler/order')
export class OrderController {
  constructor(
    private readonly order: OrderService,
    private readonly goods: GoodsService
  ) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createOrder(@UserEntity() user, @Body() params) {
    console.log(user)
    const goods = await this.goods.getGoodsById(params.goodsId)

    return this.order.createOrder({ goods, user })
  }

  @Get('get')
  @UseGuards(AuthGuard)
  async getOrderList(@UserEntity() user, @Body() params) {
    console.log(user)
    return await this.order.getOrderList({ user })
  }

  @Post('cancel')
  cancelOrder(@Body('orderId') orderId) {
    console.log(orderId)
    return this.order.updateOrder({ orderId, orderState: 'Cancel' })
  }
}

import { Injectable } from '@nestjs/common'
import { OrderState, PrismaClient } from '@prisma/client'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaClient) {}

  async createOrder(params) {
    const { goods, user } = params
    console.log(goods)

    return this.prisma.order.create({
      data: {
        wholesalerUser: {
          connect: {
            id: user.id
          }
        },
        goodsId: goods.id,
        orderState: 'PendingPay',
        payState: 'Pending',
        goodsOnOrder: {
          create: {
            goods: {
              connect: { id: goods.id }
            },
            assignedBy: goods.merchantUserId
          }
        },
        payMoney: goods.price
      }
    })
  }

  async getOrderList(params) {
    const { user } = params
    console.log(user)

    return this.prisma.order.findMany({
      where: {
        wholesalerUserId: user.id
      },
      include: {
        goodsOnOrder: {
          select: {
            goods: true
          }
        }
      }
    })
  }

  async updateOrder(params: { orderId: string; orderState: OrderState }) {
    const { orderId, orderState } = params

    return this.prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        orderState: orderState
      }
    })
  }
}

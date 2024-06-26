import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class GoodsCartService {
  constructor(private readonly prisma: PrismaClient) {}

  async createGoodsToCart(params: {
    wholesalerUserId: string
    goodsId: string
  }) {
    return await this.prisma.goodsCart.upsert({
      where: {
        wholesalerUserId: params.wholesalerUserId
      },
      update: {
        goodsId: {
          push: [params.goodsId]
        }
        // goodsId: params.goodsId
      },
      create: {
        wholesalerUserId: params.wholesalerUserId,
        goodsId: [params.goodsId]
      }
    })
  }

  async getGoodsCart(wholesalerUserId: string) {
    return await this.prisma.goodsCart.findUnique({
      where: {
        wholesalerUserId
      }
    })
  }
}

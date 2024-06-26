import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { MinioService } from 'src/modules/public/minio/minio.service'

@Injectable()
export class ShopLevelService {
  constructor(
    private prisma: PrismaClient,
    private readonly minIO: MinioService
  ) {}

  async getShopLevel() {
    return await this.prisma.shopLevel.findMany()
  }

  async delShopLevel(id) {
    return await this.prisma.shopLevel.delete({
      where: {
        id: id
      }
    })
  }

  async createShopLevel(params) {
    console.log(params)
    return await this.prisma.shopLevel.create({
      data: {
        name: params.name,
        money: Number(params.money),
        commissionRatio: 1,
        handling: 1
      }
    })
  }
  async updateShopLevel(params) {
    return await this.prisma.shopLevel.update({
      where: {
        id: params.id
      },
      data: {
        ...params
      }
    })
  }
}

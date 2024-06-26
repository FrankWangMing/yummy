import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { log } from 'console'

@Injectable()
export class GoodsCategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  async createGoodsCategory(params) {
    return this.prisma.goodsCategory.create({
      data: {
        name: params.name
      }
    })
  }
  async delGoodsCategory(params) {
    log(params)
    return this.prisma.goodsCategory.delete({
      where: {
        id: params.id
      }
    })
  }
  async updateGoodsCategory(params) {
    return this.prisma.goodsCategory.update({
      where: {
        id: params.id
      },
      data: {
        name: params.name
      }
    })
  }
  async getGoodsCategory(params) {
    return this.prisma.goodsCategory.findMany({})
  }
}

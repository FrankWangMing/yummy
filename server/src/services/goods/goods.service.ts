import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { assign } from 'lodash'
import { MinioService } from 'src/modules/public/minio/minio.service'

@Injectable()
export class GoodsService {
  constructor(private prisma: PrismaClient) {}
  async createGoods(params) {
    console.log(params)
    const { shop, goodsImgPath, mainGoodsImgPath } = params
    // this.minIO.uploadFile("",)
    console.log(shop)

    try {
      return await this.prisma.goods.create({
        data: {
          shopId: shop.id,
          merchantUserId: shop.merchantUserId,
          goodsCategoryId: params.goodsCategoryId,
          mainGoodsImg: mainGoodsImgPath,
          stock: Number(params.stock),
          price: Number(params.price),
          name: params.name,
          goodsImg: goodsImgPath
        }
      })
    } catch (error) {
      return error
    }
  }
  async getGoodsById(id) {
    try {
      return await this.prisma.goods.findUnique({
        where: { id }
      })
    } catch (error) {
      return error
    }
  }
  async getGoods(params) {
    const where = {}
    assign(where, {
      merchantUserId: params.merchantUserId
    })
    console.log(where)

    try {
      return await this.prisma.goods.findMany({
        where
      })
    } catch (error) {
      return error
    }
  }

  async delGoods(params) {
    console.log(params)

    try {
      return await this.prisma.goods.findMany({
        where: {
          id: {
            in: params
          }
        }
      })
    } catch (error) {
      return error
    }
  }
  async updateGoods(params) {
    console.log(params)

    try {
      return await this.prisma.goods.findMany({
        where: {
          id: {
            in: params
          }
        }
      })
    } catch (error) {
      return error
    }
  }
}

import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { MinioService } from 'src/modules/public/minio/minio.service'

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaClient,
    private readonly minIO: MinioService
  ) {}

  async createShop(params) {
    return this.prisma.shop.create({
      data: params
    })
  }
  async createGoodsCategory(params) {
    return this.prisma.goodsCategory.create({
      data: {
        name: params.name
      }
    })
  }

  async getShopInfo(shopId) {
    return this.prisma.shop.findUnique({
      where: {
        id: shopId
      }
    })
  }
  async updateShopInfo(param: { shopId: string; goodsCategoryIds: string[] }) {
    console.log(param)
    const { goodsCategoryIds, shopId } = param
    await this.prisma.shop.update({
      where: { id: shopId },
      data: {
        categoriesOnShop: {
          connectOrCreate: goodsCategoryIds.map((i) => ({
            where: {
              shopId_goodsCategoryId: {
                shopId: shopId,
                goodsCategoryId: i
              }
            },
            create: {
              goodsCategory: {
                connect: {
                  id: i
                }
              },
              assignedBy: shopId
            }
          }))
        }
      }
    })
  }
  async getShops() {
    return this.prisma.shop.findMany()
    // return Promise.all(
    //   (
    //     await this.prisma.shop.findMany({
    //       include: {
    //         merchantUser: {},
    //         goods: {}
    //       }
    //     })
    //   ).map(async (i) => {
    //     return {
    //       ...i,
    //       ...i.merchantUser,
    //       goodsTotal: i.goods.length,
    //       ShopImg:
    //         i.shopImg &&
    //         (await this.minIO.presignedGetObject('data', i.shopImg))
    //     }
    //   })
    // )
  }

  // shop: {
  //   create: {
  //     merchantUser: {
  //       connect: {
  //         id: user.id
  //       }
  //     },
  //     name: '1',
  //     shopAddress: '店铺地址'
  //   }
  // },
}

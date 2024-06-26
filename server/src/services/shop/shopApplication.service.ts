import { Injectable } from '@nestjs/common'
import { MerchantUser, PrismaClient, ShopState } from '@prisma/client'
import { log } from 'console'
import { assign, has } from 'lodash'
import { MinioService } from 'src/modules/public/minio/minio.service'

@Injectable()
export class ShopApplicationService {
  constructor(
    private prisma: PrismaClient,
    private readonly minIO: MinioService
  ) {}

  async applyList(params) {
    return await Promise.all(
      (
        await this.prisma.shopApplication.findMany({
          include: {
            company: {},
            MerchantUser: {},
            shop: {}
          }
        })
      ).map((i) => {
        return {
          ...i
          // shopName: i.shop.name
        }
      })
    )
  }

  async dealWithApply(params: {
    description?: string
    shopState: ShopState
    shopApplicationId: string
  }) {
    const data = {
      appliyState: params.shopState
    }
    if (params?.description) {
      assign(data, {
        description: params.description
      })
    }

    return this.prisma.$transaction([
      this.prisma.shopApplication.update({
        where: {
          id: params.shopApplicationId
        },
        data
      }),
      this.prisma.shop.update({
        where: {
          shopApplicationId: params.shopApplicationId
        },
        data: {
          shopState: params.shopState
        }
      })
    ])
  }

  async createApply(user: MerchantUser, params) {
    log(user)
    const { shopApplication } = await this.prisma.merchantUser.findUnique({
      where: {
        id: user.id
      },
      include: {
        shopApplication: {
          select: { id: true }
        }
      }
    })
    if (has(shopApplication, 'id')) {
      return shopApplication
    }
    try {
      return await this.prisma.shopApplication.create({
        data: {
          lengthOfStay: 1,
          moneyOfStay: 11,
          MerchantUser: {
            connect: {
              id: user.id
            }
          },
          company: {
            create: {
              companyName: 'companyName',
              companyAddress: 'companyAddress',
              companyCode: 'companyCode',
              companyCard: 'companyCard',
              companyOwner: '',
              ownerPhone: '',
              ownerID: '',
              ownerIDfrontend: '',
              ownerIDback: ''
            }
          },
          shop: {
            create: {
              name: '王明的小店',
              shopAddress: '天生',
              merchantUser: {
                connect: {
                  id: user.id
                }
              }
            }
          }
        }
      })
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

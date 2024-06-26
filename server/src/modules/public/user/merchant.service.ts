import { PrismaService } from 'nestjs-prisma'
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common'
import { PasswordService } from 'src/modules/public/auth/password.service'
import { AuthService } from 'src/modules/public/auth/auth.service'
import { Admin, Prisma } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { Token } from 'src/modules/public/auth/models/token.model'
import { SignupInput } from 'src/dto/users/signup.input'
import { ChangePasswordInput } from 'src/dto/users/changepassword.input'
import { MinioService } from '../minio/minio.service'
import { ShopService } from 'src/services/shop/shop.service'

@Injectable()
export class MerchantUsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private auth: AuthService,
    private jwtService: JwtService,
    private minIo: MinioService,
    private shop: ShopService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    )

    try {
      const merchantUser = await this.prisma.merchantUser.create({
        data: {
          ...payload,
          password: hashedPassword,
          shop: {}
        }
      })
      return this.auth.generateTokens({
        userId: merchantUser.id
      })
    } catch (e) {
      console.log(e)
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`phone ${payload.phone} already used.`)
      }
      throw new Error(e)
    }
  }

  getUserFromToken(token: string): Promise<Admin> {
    const id = this.jwtService.decode(token)['userId']
    return this.prisma.merchantUser.findUnique({ where: { id } })
  }
  async login(phone: string, password: string): Promise<Token> {
    const merchantUser = await this.prisma.merchantUser.findUnique({
      where: { phone: phone }
    })

    if (!merchantUser) {
      throw new NotFoundException(`No user found for phone: ${phone}`)
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      merchantUser.password
    )

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    return this.auth.generateTokens({
      userId: merchantUser.id
    })
  }
  async updateUser(phone: string, changePassword: string, username: string) {
    const hashedPassword =
      await this.passwordService.hashPassword(changePassword)

    return this.prisma.merchantUser.update({
      data: {
        username: username,
        password: hashedPassword
      },
      where: { phone: phone }
    })
  }
  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    )

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    )

    return this.prisma.merchantUser.update({
      data: {
        password: hashedPassword
      },
      where: { id: userId }
    })
  }

  // deleteUser(data: SignupInput) {
  //   return this.prisma.merchantUser.delete({
  //     where: { phone: data.phone }
  //   })
  // }

  async getAllMerchantUser() {
    return Promise.all(
      (await this.prisma.merchantUser.findMany({})).map(async (i) => {
        return {
          ...i,
          userImg:
            i.userImg &&
            (await this.minIo.presignedGetObject('data', i.userImg))
        }
      })
    )
  }

  async getShopInfoByMerchantId(MerchantId) {
    return this.prisma.merchantUser.findUnique({
      where: {
        id: MerchantId
      },
      select: {
        shop: {
          include: {
            categoriesOnShop: {
              select: {
                goodsCategory: {}
              }
            }
          }
        }
      }
    })
  }
}

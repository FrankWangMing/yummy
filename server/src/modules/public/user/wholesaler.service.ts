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

@Injectable()
export class WholesalerUsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private auth: AuthService,
    private jwtService: JwtService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    )

    try {
      const wholesalerUser = await this.prisma.wholesalerUser.create({
        data: {
          ...payload,
          goodsCart: {
            create: {}
          },
          password: hashedPassword
        }
      })
      return await this.auth.generateTokens({
        userId: wholesalerUser.id
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

  validateUser(userId: string): Promise<Admin> {
    return this.prisma.wholesalerUser.findUnique({ where: { id: userId } })
  }

  getUserFromToken(token: string): Promise<Admin> {
    const id = this.jwtService.decode(token)['userId']
    return this.prisma.wholesalerUser.findUnique({ where: { id } })
  }
  async login(phone: string, password: string): Promise<Token> {
    const wholesalerUser = await this.prisma.wholesalerUser.findUnique({
      where: { phone: phone }
    })

    if (!wholesalerUser) {
      throw new NotFoundException(`No wholesalerUser found for phone: ${phone}`)
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      wholesalerUser.password
    )

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    return this.auth.generateTokens({
      userId: wholesalerUser.id
    })
  }
  async updateUser(phone: string, changePassword: string, username: string) {
    const hashedPassword =
      await this.passwordService.hashPassword(changePassword)

    return this.prisma.wholesalerUser.update({
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

    return this.prisma.wholesalerUser.update({
      data: {
        password: hashedPassword
      },
      where: { id: userId }
    })
  }

  // deleteUser(data: SignupInput) {
  //   return this.prisma.wholesaler.delete({
  //     where: { phone: data.phone }
  //   })
  // }

  getAllUsers() {
    // return this.prisma.wholesaler.findMany({
    //   where: {
    //     role: 'USER'
    //   }
    // })
  }
}

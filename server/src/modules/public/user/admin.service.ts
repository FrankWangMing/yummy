import { PrismaService } from 'nestjs-prisma'
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common'
import { PasswordService } from 'src/modules/public/auth/password.service'
import { AuthService } from 'src/modules/public/auth/auth.service'
import { Token } from 'src/modules/public/auth/models/token.model'
import { SignupInput } from 'src/dto/users/signup.input'
import { Prisma } from '@prisma/client'

@Injectable()
export class AdminUsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private auth: AuthService
    // private jwtService: JwtService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    )

    try {
      const user = await this.prisma.admin.create({
        data: {
          ...payload,
          password: hashedPassword
          // role: 'USER'
        }
      })

      return await this.auth.generateTokens({
        userId: user.id
      })
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`phone ${payload.phone} already used.`)
      }
      throw new Error(e)
    }
  }

  // getUserFromToken(token: string): Promise<Admin> {
  // const id = this.jwtService.decode(token)['userId']
  // return this.prisma.admin.findUnique({ where: { id } })
  // }
  async login(phone: string, password: string): Promise<Token> {
    const user = await this.prisma.admin.findUnique({ where: { phone } })

    if (!user) {
      throw new NotFoundException(`No user found for phone: ${phone}`)
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    )

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    return this.auth.generateTokens({
      userId: user.id
    })
  }
  async updateUser(phone: string, changePassword: string, username: string) {
    const hashedPassword =
      await this.passwordService.hashPassword(changePassword)

    return this.prisma.admin.update({
      data: {
        username: username,
        password: hashedPassword
      },
      where: { phone: phone }
    })
  }
  // async changePassword(
  //   userId: string,
  //   userPassword: string,
  //   changePassword: ChangePasswordInput
  // ) {
  //   const passwordValid = await this.passwordService.validatePassword(
  //     changePassword.oldPassword,
  //     userPassword
  //   )

  //   if (!passwordValid) {
  //     throw new BadRequestException('Invalid password')
  //   }

  //   const hashedPassword = await this.passwordService.hashPassword(
  //     changePassword.newPassword
  //   )

  //   return this.prisma.admin.update({
  //     data: {
  //       password: hashedPassword
  //     },
  //     where: { id: userId }
  //   })
  // }

  // deleteUser(data: SignupInput) {
  //   return this.prisma.admin.delete({
  //     where: { phone: data.phone }
  //   })
  // }

  getAllUsers() {
    // return this.prisma.user.findMany({
    //   where: {
    //     role: 'USER'
    //   }
    // })
  }
}

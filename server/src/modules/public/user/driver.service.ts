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
import { ChangePasswordInput } from 'src/dto/users/changepassword.input'
import { SignupInput } from 'src/dto/users/signup.input'

@Injectable()
export class DriverUsersService {
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
      const driverUser = await this.prisma.driverUser.create({
        data: {
          ...payload,
          password: hashedPassword
        }
      })

      return await this.auth.generateTokens({
        userId: driverUser.id
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

  getUserFromToken(token: string): Promise<Admin> {
    const id = this.jwtService.decode(token)['userId']
    return this.prisma.driverUser.findUnique({ where: { id } })
  }
  async login(phone: string, password: string): Promise<Token> {
    const driverUser = await this.prisma.driverUser.findUnique({
      where: { phone: phone }
    })
    if (driverUser.state == 'UNAVAILABLE') {
      throw new NotFoundException(`No driverUser found for phone: ${phone}`)
    }
    if (!driverUser) {
      throw new NotFoundException(`No driverUser found for phone: ${phone}`)
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      driverUser.password
    )

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    return this.auth.generateTokens({
      userId: driverUser.id
    })
  }
  async updateUser(phone: string, changePassword: string, username: string) {
    const hashedPassword =
      await this.passwordService.hashPassword(changePassword)

    return this.prisma.driverUser.update({
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

    return this.prisma.driverUser.update({
      data: {
        password: hashedPassword
      },
      where: { id: userId }
    })
  }

  // deleteUser(data: SignupInput) {
  //   return this.prisma.driverUser.delete({
  //     where: { phone: data.phone }
  //   })
  // }

  getAllUsers() {
    // return this.prisma.driverUser.findMany({
    //   where: {
    //     role: 'USER'
    //   }
    // })
  }
}

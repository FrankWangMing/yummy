import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Token } from './models/token.model'
import { SecurityConfig } from 'src/common/configs/config.interface'
import { PrismaService } from 'nestjs-prisma'
import { JwtDto } from 'src/dto/users/jwt.dto'
import { log } from 'console'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private prisma: PrismaService
  ) {}

  async generateTokens(payload: { userId: string }): Promise<Token> {
    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: await this.generateRefreshToken(payload)
    }
  }

  private async generateAccessToken(payload: {
    userId: string
  }): Promise<string> {
    log(this.configService.get('JWT_REFRESH_SECRET'))
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: 86400000
    })
  }

  private async generateRefreshToken(payload: {
    userId: string
  }): Promise<string> {
    const securityConfig = this.configService.get<SecurityConfig>('security')
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn
    })
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      })
      return this.generateTokens({
        userId
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  async validateUser(payload: JwtDto, role): Promise<boolean> {
    const userId = payload.userId

    let result
    switch (role) {
      case 'admin':
        result = this.prisma.admin.findUnique({
          where: { id: userId }
        })
        break
      case 'merchant':
        result = this.prisma.merchantUser.findUnique({
          where: { id: userId },
          include: {
            shop: {}
          }
        })
        break
      case 'wholesaler':
        result = this.prisma.wholesalerUser.findUnique({
          where: { id: userId }
        })
        break
      case 'driver':
        result = this.prisma.driverUser.findUnique({
          where: { id: userId }
        })
        break
    }
    if (!(await result)) {
      return null
    }
    return await result
  }
}

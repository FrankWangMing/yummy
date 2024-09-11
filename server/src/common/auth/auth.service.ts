import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Token } from './models/token.model'
import { SecurityConfig } from 'src/common/configs/config.interface'
import { PrismaService } from 'nestjs-prisma'
import { log } from 'console'
import { JwtDto } from './users/jwt.dto'

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

    if (!(await result)) {
      return null
    }
    return await result
  }
}

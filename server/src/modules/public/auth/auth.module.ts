import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { SecurityConfig } from 'src/common/configs/config.interface'
import { PasswordService } from './password.service'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security')
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn
          }
        }
      },
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, JwtService, PasswordService],
  exports: [AuthService, JwtService, PasswordService]
})
export class AuthModule {}

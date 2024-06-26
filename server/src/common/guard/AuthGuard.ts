import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { get, isNull } from 'lodash'
import { AuthService } from 'src/modules/public/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { log } from 'console'

export enum Role {
  Admin,
  Wholesaler,
  Driver,
  Merchant
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private auth: AuthService,
    readonly configService: ConfigService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    const role = request.route.path.split('/')[1]
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET')
      })

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = await this.auth.validateUser(payload, role)

      if (!isNull(request.user)) {
        return true
      } else {
        throw new UnauthorizedException()
      }
    } catch {
      throw new UnauthorizedException()
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      get(request, 'headers.authorization', '').split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

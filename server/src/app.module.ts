import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'
import config from 'src/common/configs/config'
import { loggingMiddleware } from 'src/common/middleware/logging.middleware'
import { AppGateway } from './app.gateway'
import { CacheModule } from '@nestjs/cache-manager'
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 5
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))] // configure your prisma middleware
      }
    })
  ],
  controllers: [

  ],
  providers: [
    AppGateway
  ]
})
export class AppModule { }

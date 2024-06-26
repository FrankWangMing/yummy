import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'
import config from 'src/common/configs/config'
import { loggingMiddleware } from 'src/common/middleware/logging.middleware'
import { AdminModule } from './modules/admin/admin.module'
import { WholesalerModule } from './modules/wholesaler/wholesaler.module'
import { DriverModule } from './modules/driver/driver.module'
import { MerchantModule } from './modules/merchant/merchant.module'
import { PublicModule } from './modules/public/public.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))] // configure your prisma middleware
      }
    }),
    AdminModule,
    WholesalerModule,
    DriverModule,
    MerchantModule,
    PublicModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

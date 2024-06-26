import { Module } from '@nestjs/common'
import { AdminUsersService } from './admin.service'
import { DriverUsersService } from './driver.service'
import { MerchantUsersService } from './merchant.service'
import { WholesalerUsersService } from './wholesaler.service'
import { AuthModule } from '../auth/auth.module'
import { WxUserController } from '../wxUser/user.controller'
import { WXUsersService } from '../wxUser/user.service'
import { EventsModule } from '../events/events.module'

@Module({
  imports: [AuthModule, EventsModule],
  providers: [
    DriverUsersService,
    MerchantUsersService,
    AdminUsersService,
    WholesalerUsersService,
    WXUsersService
  ],
  controllers: [WxUserController],
  exports: [
    AuthModule,
    EventsModule,
    MerchantUsersService,
    DriverUsersService,
    AdminUsersService,
    WholesalerUsersService
  ]
})
export class UserModule {}

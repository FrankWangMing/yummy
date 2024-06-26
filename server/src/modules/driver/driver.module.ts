import { Module } from '@nestjs/common'
import { PublicModule } from '../public/public.module'
import { UserController } from './user/user.controller'

@Module({
  imports: [PublicModule],
  controllers: [UserController],
  providers: [],
  exports: [PublicModule]
})
export class DriverModule {}

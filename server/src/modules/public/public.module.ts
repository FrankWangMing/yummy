import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { RoleService } from './role/role.service'
import { RoleController } from './role/role.controller'

@Module({
  imports: [UserModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [UserModule]
})
export class PublicModule {}

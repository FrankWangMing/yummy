import { Controller, Post } from '@nestjs/common'
import { RoleService } from './role.service'

@Controller('role')
export class RoleController {
  constructor(readonly roleService: RoleService) {}

  @Post()
  login() {
    this.roleService.login()
  }

  @Post()
  choseRole() {
    this.roleService.role()
  }
}

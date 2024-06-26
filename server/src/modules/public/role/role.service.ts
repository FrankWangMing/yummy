import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaClient) {}

  login() {}

  role() {}
}

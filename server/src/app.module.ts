import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'
import config from 'src/common/configs/config'
import { loggingMiddleware } from 'src/common/middleware/logging.middleware'
import { CacheModule } from '@nestjs/cache-manager'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module'
import { RoomModule } from './room/room.module'
const uri =
  'mongodb+srv://frank:LmxpnwjLlMe4PUFS@frank.vn97nj2.mongodb.net/?retryWrites=true&w=majority&appName=frank'
// const uri =
//   'mongodb+srv://mongo_Pr4AGc:mongo_6xhxZi@frank.vn97nj2.mongodb.net/?retryWrites=true&w=majority&appName=frank'

@Module({
  imports: [
    MongooseModule.forRoot(uri),
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
    }),
    UserModule,
    RoomModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

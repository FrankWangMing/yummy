import { Module } from '@nestjs/common'
import { MinioService } from './minio.service'
import { MinioController } from './minio.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService, HttpModule]
})
export class MinioModule {}

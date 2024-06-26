import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query
} from '@nestjs/common'
import { MinioService } from './minio.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { log } from 'console'

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    log(file.originalname)
    return await this.minioService.uploadFile(
      'data',
      file.originalname,
      file.buffer
    )
  }

  @Get('get')
  async getSomeById(@Query('id') id: string) {
    console.log(id)
    return await this.minioService.getFileById('data', id)
  }

  @Get('getImg')
  async getFile(@Query('id') id: string) {
    return await this.minioService.presignedGetObject('data', id)
  }
}
// d41d8cd98f00b204e9800998ecf8427e

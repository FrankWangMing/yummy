import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig
} from 'src/common/configs/config.interface'
import { TransformInterceptor } from './common/interception/transform.interception'
import * as fs from 'fs';
const path = require('path');
async function bootstrap() {
  const keyPath = path.resolve(__dirname, '../nginx/yummy.frankwm.cn.key');
  const certPath = path.resolve(__dirname, '../nginx/yummy.frankwm.cn_bundle.crt');
  const httpsOptions = {
    key:  fs.readFileSync(keyPath) ,  // 私钥文件
    cert: fs.readFileSync(certPath),  // 证书文件
  };
  const app = await NestFactory.create(AppModule,{
    httpsOptions,
  })

  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(new ValidationPipe())

  const configService = app.get(ConfigService)
  const nestConfig = configService.get<NestConfig>('nest')
  const corsConfig = configService.get<CorsConfig>('cors')
  const swaggerConfig = configService.get<SwaggerConfig>('swagger')
  app.useGlobalInterceptors(new TransformInterceptor())
  // app.useGlobalFilters(new HttpExceptionFilter())
  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(swaggerConfig.path || 'api', app, document)
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors()
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000)
}
bootstrap()

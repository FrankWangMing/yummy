import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig
} from 'src/common/configs/config.interface'
import { TransformInterceptor } from './common/interception/transform.interception'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Validation
  app.useGlobalPipes(new ValidationPipe())

  // Prisma Client Exception Filter for unhandled exceptions
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

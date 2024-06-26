// src/filter/http-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { Response } from 'express'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs')
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const message = exception.message
    response.status(status).json({
      code: status,
      message,
      time: dayjs().format('YYYY-MM-DDTHH:mm:ss')
    })
  }
}

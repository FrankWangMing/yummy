// import {}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Observable, map } from 'rxjs'

interface Data<T> {
  status: number
  data: T
  message: string
  success: number
}
@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return { data, status: 0, message: '', success: 0 }
      })
    )
  }
}

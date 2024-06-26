import { PartialType } from '@nestjs/swagger'
import { CreateMinioDto } from './create-minio.dto'

export class UpdateMinioDto extends PartialType(CreateMinioDto) {}

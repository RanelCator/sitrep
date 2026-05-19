// src/features/auth/dto/ars-login.dto.ts

import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class ArsLoginDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number
}
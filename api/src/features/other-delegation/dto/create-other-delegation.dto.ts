// src/features/other-delegation/dto/create-other-delegation.dto.ts
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateOtherDelegationDto {
  @IsString()
  @IsNotEmpty()
  description!: string

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expected_delegates!: number

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  arrived!: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
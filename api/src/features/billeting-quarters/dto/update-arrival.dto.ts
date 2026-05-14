// src/features/billeting-quarters/dto/update-arrival.dto.ts
import { Type } from 'class-transformer'
import { IsDate, IsInt, IsOptional, Min } from 'class-validator'

export class UpdateArrivalDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  DateTimeEntered?: Date

  @Type(() => Number)
  @IsInt()
  @Min(0)
  athletes!: number

  @Type(() => Number)
  @IsInt()
  @Min(0)
  coaches!: number

  @Type(() => Number)
  @IsInt()
  @Min(0)
  advance_party!: number

  @Type(() => Number)
  @IsInt()
  @Min(0)
  trainers!: number
}
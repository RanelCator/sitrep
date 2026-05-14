// create-billeting-quarter.dto.ts
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class CreateBilletingQuarterDto {
  @IsString()
  @IsNotEmpty()
  Billeting_Quarters!: string

  @IsString()
  @IsNotEmpty()
  Delegation!: string

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  Preparedness_Rating!: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expected_delegates?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
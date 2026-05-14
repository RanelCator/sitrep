// src/features/misc/dto/update-misc.dto.ts
import { Type } from 'class-transformer'
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class UpdateMiscDto {
  // PLAYING VENUES

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  infrastructure?: number

  @IsOptional()
  @IsString()
  infrastructure_description?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  peripherals?: number

  @IsOptional()
  @IsString()
  peripherals_description?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  sports_equipment?: number

  @IsOptional()
  @IsString()
  sports_equipment_description?: string

  // BILLETING

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  billeting_quarters_assigned?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  identified_billeting_quarters?: number

  @IsOptional()
  @IsString()
  identified_billeting_quarters_text?: string
}
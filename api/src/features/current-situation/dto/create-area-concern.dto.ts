// src/features/current-situation/dto/create-area-concern.dto.ts
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateAreaConcernDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsMongoId()
  committeeId!: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
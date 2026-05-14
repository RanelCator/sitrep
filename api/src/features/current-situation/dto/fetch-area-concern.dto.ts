// src/features/current-situation/dto/fetch-area-concern.dto.ts
import { Transform } from 'class-transformer'
import {
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class FetchAreaConcernDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  limit: number = 10

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsMongoId()
  committeeId?: string

  @IsOptional()
  @IsString()
  sortBy: string = 'name'

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc'
}
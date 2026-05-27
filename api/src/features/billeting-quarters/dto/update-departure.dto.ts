import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator'

export class UpdateDepartureDto {
  @IsOptional()
  @IsDateString()
  DateTimeEntered?: Date

  @IsOptional()
  @IsInt()
  @Min(0)
  athletes?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  coaches?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  advance_party?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  trainers?: number
}
// src/features/current-situation/dto/create-current-situation.dto.ts
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCurrentSituationDto {
  @Type(() => Date)
  @IsDate()
  DateTimeEntered!: Date

  @IsString()
  @IsNotEmpty()
  Committee!: string

  @IsString()
  @IsNotEmpty()
  area_concern!: string

  @IsString()
  @IsNotEmpty()
  cuurent_situation!: string

  @IsOptional()
  @IsString()
  issues_concerns?: string

  @IsOptional()
  @IsString()
  actions_undertaken?: string

  @IsOptional()
  @IsString()
  recommendations?: string
}
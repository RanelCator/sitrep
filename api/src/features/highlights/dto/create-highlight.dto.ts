// src/features/highlights/dto/create-highlight.dto.ts
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString } from 'class-validator'

export class CreateHighlightDto {
  @Type(() => Date)
  @IsDate()
  DateTimeEntered!: Date

  @IsString()
  @IsNotEmpty()
  description!: string
}
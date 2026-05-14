// src/features/other-information/dto/create-other-information.dto.ts
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString } from 'class-validator'

export class CreateOtherInformationDto {
  @IsString()
  @IsNotEmpty()
  description!: string
}
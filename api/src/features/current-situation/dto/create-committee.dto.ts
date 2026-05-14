// src/features/current-situation/dto/create-committee.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCommitteeDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
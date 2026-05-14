// src/features/reported-incidents/dto/create-reported-incident.dto.ts
import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class CreateReportedIncidentDto {
  @Type(() => Date)
  @IsDate()
  Date!: Date

  @IsOptional()
  @IsString()
  Time?: string

  @IsOptional()
  @IsString()
  venue_location?: string

  @IsOptional()
  @IsString()
  Incident?: string

  @IsOptional()
  @IsString()
  persons_involved?: string

  @IsOptional()
  @IsString()
  initial_action_taken?: string

  @IsOptional()
  @IsString()
  current_status?: string

  @IsOptional()
  @IsString()
  Remarks?: string
}
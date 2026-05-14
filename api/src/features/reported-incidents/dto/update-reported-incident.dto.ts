// src/features/reported-incidents/dto/update-reported-incident.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateReportedIncidentDto } from './create-reported-incident.dto'

export class UpdateReportedIncidentDto extends PartialType(
  CreateReportedIncidentDto,
) {}
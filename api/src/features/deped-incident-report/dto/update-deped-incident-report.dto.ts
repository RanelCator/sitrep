import { PartialType } from '@nestjs/mapped-types'
import { CreateDepedIncidentReportDto } from './create-deped-incident-report.dto'

export class UpdateDepedIncidentReportDto extends PartialType(
  CreateDepedIncidentReportDto,
) {}
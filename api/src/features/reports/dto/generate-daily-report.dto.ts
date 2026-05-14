// generate-daily-report.dto.ts
import { IsDateString } from 'class-validator'

export class GenerateDailyReportDto {
  @IsDateString()
  ReportDate!: string
}
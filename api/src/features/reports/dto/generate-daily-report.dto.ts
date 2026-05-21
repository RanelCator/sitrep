// generate-daily-report.dto.ts
import {
  IsDateString,
  IsIn,
} from 'class-validator'

export class GenerateDailyReportDto {
  @IsDateString()
  ReportDate!: string

  @IsIn(['8am', '5pm'])
  ReportCutoff!: '8am' | '5pm'
}
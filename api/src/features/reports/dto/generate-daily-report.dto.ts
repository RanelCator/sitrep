import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

export type ReportCutoff =
  | '8am'
  | '5pm'
  | '--'
  | 'current-day'

export class GenerateDailyReportDto {
  @IsString()
  ReportDate!: string

  @IsOptional()
  @IsEnum([
    '8am',
    '5pm',
    '--',
    'current-day',
  ])
  ReportCutoff!: ReportCutoff
}
import { IsOptional, IsString } from 'class-validator'

export class CreateDepedIncidentReportDto {
  @IsString()
  email!: string

  @IsString()
  reporterName!: string

  @IsString()
  designationRole!: string

  @IsString()
  mobileNumber!: string

  @IsString()
  agencyOfficeRegion!: string

  @IsString()
  incidentType!: string

  @IsOptional()
  @IsString()
  incidentTypeOther?: string

  @IsString()
  date!: string

  @IsString()
  time!: string

  @IsString()
  location!: string

  @IsOptional()
  @IsString()
  locationOther?: string

  @IsString()
  area!: string

  @IsOptional()
  @IsString()
  areaOther?: string

  @IsString()
  briefDescription!: string

  @IsString()
  immediateActionsTaken!: string

  @IsOptional()
  @IsString()
  currentStatus?: string

  @IsOptional()
  @IsString()
  remarks?: string
}
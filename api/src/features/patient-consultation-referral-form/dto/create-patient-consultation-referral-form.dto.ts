// src/features/patient-consultation-referral-form/dto/create-patient-consultation-referral-form.dto.ts
import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientConsultationReferralFormDto {
  @IsDateString()
  formDate!: string;

  @IsString()
  delegationType!: string;

  @IsOptional()
  @IsString()
  delegationTypeOther?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  division?: string;

  @IsOptional()
  @IsString()
  addressAndContactNumber?: string;

  @IsString()
  patientName!: string;

  @IsOptional()
@Transform(({ value }) =>
  value === '' ? undefined : value,
)
@IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsString()
  ageSex?: string;

  @IsOptional()
  @IsString()
  sportsEvent?: string;

  @IsOptional()
  @IsString()
  natureOfIncident?: string;

  @IsOptional()
  @IsString()
  placeOfIncident?: string;

  @IsOptional()
    @Transform(({ value }) =>
    value === '' ? undefined : value,
    )
    @IsDateString()
  incidentDateTime?: string;

  @IsOptional()
  @IsString()
  chiefComplaints?: string;

  @IsOptional()
  @IsString()
  peFindings?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @IsOptional()
  @IsString()
  currentMedications?: string;

  @IsOptional()
  @IsString()
  pulseRate?: string;

  @IsOptional()
  @IsString()
  pastMedicalHistory?: string;

  @IsOptional()
  @IsString()
  respirationRate?: string;

  @IsOptional()
  @IsString()
  lastMealTaken?: string;

  @IsOptional()
  @IsString()
  temperature?: string;

  @IsOptional()
  @IsString()
  treatmentIntervention?: string;

  @IsOptional()
  @IsString()
  impressionDiagnosis?: string;

  @IsOptional()
  @IsBoolean()
  isTreated?: boolean;

  @IsOptional()
  @IsBoolean()
  isUnderObservation?: boolean;

  @IsOptional()
  @IsBoolean()
  isReferred?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  nodSignature?: string;

  @IsOptional()
  @IsString()
  physicianSignature?: string;
}
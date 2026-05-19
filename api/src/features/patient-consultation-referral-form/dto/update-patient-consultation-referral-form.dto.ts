// src/features/patient-consultation-referral-form/dto/update-patient-consultation-referral-form.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientConsultationReferralFormDto } from './create-patient-consultation-referral-form.dto';

export class UpdatePatientConsultationReferralFormDto extends PartialType(
  CreatePatientConsultationReferralFormDto,
) {}
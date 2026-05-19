// src/features/patient-consultation-referral-form/patient-consultation-referral-form.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  PatientConsultationReferralForm,
  PatientConsultationReferralFormSchema,
} from './schemas/patient-consultation-referral-form.schema';
import { PatientConsultationReferralFormController } from './patient-consultation-referral-form.controller';
import { PatientConsultationReferralFormService } from './patient-consultation-referral-form.service';
import { SqlServerAuthModule } from '@/sql-server/sql-server-auth.module';

@Module({
  imports: [
     SqlServerAuthModule,
    MongooseModule.forFeature([
      {
        name: PatientConsultationReferralForm.name,
        schema: PatientConsultationReferralFormSchema,
      },
    ]),
  ],
  controllers: [PatientConsultationReferralFormController],
  providers: [PatientConsultationReferralFormService],
  exports: [PatientConsultationReferralFormService],
})
export class PatientConsultationReferralFormModule {}
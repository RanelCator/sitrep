// src/features/patient-consultation-referral-form/schemas/patient-consultation-referral-form.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PatientConsultationReferralFormDocument =
  HydratedDocument<PatientConsultationReferralForm>;

@Schema({ timestamps: true })
export class PatientConsultationReferralForm {
  @Prop({ required: true })
  formDate!: Date;

  @Prop({ required: true })
  delegationType!: string;

  @Prop()
  delegationTypeOther?: string;

  @Prop()
  region?: string;

  @Prop()
  division?: string;

  @Prop()
  addressAndContactNumber?: string;

  @Prop({ required: true })
  patientName!: string;

  @Prop()
  birthdate?: Date;

  @Prop()
  ageSex?: string;

  @Prop()
  sportsEvent?: string;

  @Prop()
  natureOfIncident?: string;

  @Prop()
  placeOfIncident?: string;

  @Prop()
  incidentDateTime?: Date;

  @Prop()
  chiefComplaints?: string;

  @Prop()
  peFindings?: string;

  @Prop()
  allergies?: string;

  @Prop()
  bloodPressure?: string;

  @Prop()
  currentMedications?: string;

  @Prop()
  pulseRate?: string;

  @Prop()
  pastMedicalHistory?: string;

  @Prop()
  respirationRate?: string;

  @Prop()
  lastMealTaken?: string;

  @Prop()
  temperature?: string;

  @Prop()
  treatmentIntervention?: string;

  @Prop()
  impressionDiagnosis?: string;

  @Prop({ default: false })
  isTreated!: boolean;

  @Prop({ default: false })
  isUnderObservation!: boolean;

  @Prop({ default: false })
  isReferred!: boolean;

  @Prop()
  remarks?: string;

  @Prop()
  nodSignature?: string;

  @Prop()
  physicianSignature?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({
    default: false,
  })
  isEncoded!: boolean
}

export const PatientConsultationReferralFormSchema =
  SchemaFactory.createForClass(PatientConsultationReferralForm);
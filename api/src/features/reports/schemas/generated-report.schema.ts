// src/features/reports/schemas/generated-report.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, SchemaTypes } from 'mongoose'

export type GeneratedReportDocument =
  HydratedDocument<GeneratedReport>

@Schema({ timestamps: true })
export class GeneratedReport {
  @Prop({ required: true })
  entryDate!: string

  @Prop({
    type: SchemaTypes.Mixed,
    required: true,
  })
  data!: Record<string, any>
}

export const GeneratedReportSchema =
  SchemaFactory.createForClass(GeneratedReport)

GeneratedReportSchema.index({ entryDate: 1 })
GeneratedReportSchema.index({ createdAt: -1 })
// src/features/reported-incidents/schemas/reported-incident.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ReportedIncidentDocument = HydratedDocument<ReportedIncident>

@Schema({ timestamps: true })
export class ReportedIncident {
  @Prop({ required: true })
  Date!: Date

  @Prop({ trim: true })
  Time!: string

  @Prop({ trim: true })
  venue_location!: string

  @Prop({ trim: true })
  Incident!: string

  @Prop({ trim: true })
  persons_involved!: string

  @Prop({ trim: true })
  initial_action_taken!: string

  @Prop({ trim: true })
  current_status!: string

  @Prop({ trim: true })
  Remarks?: string

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  AddedBy!: Types.ObjectId
}

export const ReportedIncidentSchema =
  SchemaFactory.createForClass(ReportedIncident)
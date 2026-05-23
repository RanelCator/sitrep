import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type DepedIncidentReportDocument =
  HydratedDocument<DepedIncidentReport>

@Schema({ timestamps: true })
export class DepedIncidentReport {
  @Prop({ type: String, required: true, trim: true })
  email!: string

  @Prop({ type: String, required: true, trim: true })
  reporterName!: string

  @Prop({ type: String, required: true, trim: true })
  designationRole!: string

  @Prop({ type: String, required: true, trim: true })
  mobileNumber!: string

  @Prop({ type: String, required: true, trim: true })
  agencyOfficeRegion!: string

  @Prop({ type: String, required: true, trim: true })
  incidentType!: string

  @Prop({ type: String, trim: true, default: '' })
  incidentTypeOther!: string

  @Prop({ type: String, required: true, trim: true })
  date!: string

  @Prop({ type: String, required: true, trim: true })
  time!: string

  @Prop({ type: String, required: true, trim: true })
  location!: string

  @Prop({ type: String, trim: true, default: '' })
  locationOther!: string

  @Prop({ type: String, required: true, trim: true })
  area!: string

  @Prop({ type: String, trim: true, default: '' })
  areaOther!: string

  @Prop({ type: String, required: true, trim: true })
  briefDescription!: string

  @Prop({ type: String, required: true, trim: true })
  immediateActionsTaken!: string

  @Prop({ type: String, trim: true, default: '' })
  currentStatus!: string

  @Prop({ type: String, trim: true, default: '' })
  remarks!: string
}

export const DepedIncidentReportSchema =
  SchemaFactory.createForClass(DepedIncidentReport)
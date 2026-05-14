// src/features/current-situation/schemas/current-situation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type CurrentSituationDocument = HydratedDocument<CurrentSituation>

@Schema({ timestamps: true })
export class CurrentSituation {
  @Prop({ required: true })
  DateTimeEntered!: Date

  @Prop({ required: true, trim: true })
  Committee!: string

  @Prop({ required: true, trim: true })
  area_concern!: string

  @Prop({ required: true, trim: true })
  cuurent_situation!: string

  @Prop({ trim: true })
  issues_concerns?: string

  @Prop({ trim: true })
  actions_undertaken?: string

  @Prop({ trim: true })
  recommendations?: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  AddedBy!: Types.ObjectId
}

export const CurrentSituationSchema =
  SchemaFactory.createForClass(CurrentSituation)
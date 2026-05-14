// src/features/misc/schemas/misc.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type MiscDocument = HydratedDocument<Misc>

@Schema({ timestamps: true })
export class Misc {
  // PLAYING VENUES

  @Prop({ default: 0 })
  infrastructure!: number

  @Prop({ default: '' })
  infrastructure_description!: string

  @Prop({ default: 0 })
  peripherals!: number

  @Prop({ default: '' })
  peripherals_description!: string

  @Prop({ default: 0 })
  sports_equipment!: number

  @Prop({ default: '' })
  sports_equipment_description!: string

  // BILLETING

  @Prop({ default: 0 })
  billeting_quarters_assigned!: number

  @Prop({ default: 0 })
  identified_billeting_quarters!: number

  @Prop({ default: '' })
  identified_billeting_quarters_text!: string

  // AUDIT

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId
}

export const MiscSchema = SchemaFactory.createForClass(Misc)
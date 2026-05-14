// src/features/billeting-quarters/schemas/billeting-quarter.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type BilletingQuarterDocument = HydratedDocument<BilletingQuarter>

class ArrivalInfo {
  DateTimeEntered!: Date
  athletes!: number
  coaches!: number
  advance_party!: number
  trainers!: number
}

@Schema({ timestamps: true })
export class BilletingQuarter {
  @Prop({ required: true, trim: true })
  Billeting_Quarters!: string

  @Prop({ required: true, trim: true })
  Delegation!: string

  @Prop({
    required: true,
    min: 1,
    max: 100,
  })
  Preparedness_Rating!: number

  @Prop({ default: 0 })
  expected_delegates!: number

  @Prop({
    type: {
      DateTimeEntered: Date,
      athletes: Number,
      coaches: Number,
      advance_party: Number,
      trainers: Number,
    },
    default: null,
  })
  arrived?: ArrivalInfo

  @Prop({ default: true })
  isActive!: boolean

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  AddedBy!: Types.ObjectId
}

export const BilletingQuarterSchema =
  SchemaFactory.createForClass(BilletingQuarter)
// src/features/billeting-quarters/schemas/delegation-arrival-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type DelegationArrivalLogDocument =
  HydratedDocument<DelegationArrivalLog>

@Schema({ timestamps: true })
export class DelegationArrivalLog {
  @Prop({ required: true })
  DateTimeEntered!: Date

  @Prop({ required: true, default: 0 })
  athletes!: number

  @Prop({ required: true, default: 0 })
  coaches!: number

  @Prop({ required: true, default: 0 })
  advance_party!: number

  @Prop({ required: true, default: 0 })
  trainers!: number

  @Prop({
    type: Types.ObjectId,
    ref: 'BilletingQuarter',
    required: true,
  })
  delegation_id!: Types.ObjectId
}

export const DelegationArrivalLogSchema =
  SchemaFactory.createForClass(DelegationArrivalLog)
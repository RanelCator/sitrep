// src/features/other-delegation/schemas/other-delegation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type OtherDelegationDocument = HydratedDocument<OtherDelegation>

@Schema({ timestamps: true })
export class OtherDelegation {
  @Prop({ required: true, trim: true })
  description!: string

  @Prop({ required: true, min: 0, default: 0 })
  expected_delegates!: number

  @Prop({ required: true, min: 0, default: 0 })
  arrived!: number

  @Prop({ default: true })
  isActive!: boolean

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  AddedBy!: Types.ObjectId
}

export const OtherDelegationSchema =
  SchemaFactory.createForClass(OtherDelegation)
// src/features/current-situation/schemas/committee.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type CommitteeDocument = HydratedDocument<Committee>

@Schema({ timestamps: true })
export class Committee {
  @Prop({ required: true, trim: true, unique: true })
  name!: string

  @Prop({ default: true })
  isActive!: boolean

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  AddedBy!: Types.ObjectId
}

export const CommitteeSchema = SchemaFactory.createForClass(Committee)
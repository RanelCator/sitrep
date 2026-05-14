// src/features/highlights/schemas/highlight.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type HighlightDocument = HydratedDocument<Highlight>

@Schema({ timestamps: true })
export class Highlight {
  @Prop({ required: true })
  DateTimeEntered!: Date

  @Prop({ required: true, trim: true })
  description!: string

  @Prop({ required: true, unique: true })
  entryDate!: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  AddedBy!: Types.ObjectId
}

export const HighlightSchema = SchemaFactory.createForClass(Highlight)

HighlightSchema.index({ entryDate: 1 }, { unique: true })
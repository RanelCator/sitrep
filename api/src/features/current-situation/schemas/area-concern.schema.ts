// src/features/current-situation/schemas/area-concern.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type AreaConcernDocument = HydratedDocument<AreaConcern>

@Schema({ timestamps: true })
export class AreaConcern {
  @Prop({ required: true, trim: true })
  name!: string

  @Prop({ type: Types.ObjectId, ref: 'Committee', required: true })
  committeeId!: Types.ObjectId

  @Prop({ required: true, trim: true })
  committeeName!: string

  @Prop({ default: true })
  isActive!: boolean

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  AddedBy!: Types.ObjectId
}

export const AreaConcernSchema = SchemaFactory.createForClass(AreaConcern)

AreaConcernSchema.index(
  {
    committeeId: 1,
    name: 1,
  },
  {
    unique: true,
  },
)
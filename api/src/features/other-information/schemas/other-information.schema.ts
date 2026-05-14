// src/features/other-information/schemas/other-information.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type OtherInformationDocument =
  HydratedDocument<OtherInformation>

@Schema({ timestamps: true })
export class OtherInformation {
  
  @Prop({ required: true, trim: true })
  description!: string

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  AddedBy!: Types.ObjectId
}

export const OtherInformationSchema =
  SchemaFactory.createForClass(OtherInformation)
// src/features/forms/schemas/form-submission.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type FormSubmissionDocument = HydratedDocument<FormSubmission>

@Schema({ timestamps: true })
export class FormSubmission {
  @Prop({ type: Types.ObjectId, ref: 'Form', required: true })
  formId!: Types.ObjectId

  @Prop({ required: true })
  formTitle!: string

  @Prop({ type: Object, required: true })
  data!: Record<string, unknown>

  @Prop({ type: Types.ObjectId, ref: 'User' })
  submittedBy?: Types.ObjectId
}

export const FormSubmissionSchema =
  SchemaFactory.createForClass(FormSubmission)
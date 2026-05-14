// src/features/forms/schemas/form.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FormDocument = HydratedDocument<Form>

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'number'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'radio'

export interface FormField {
  key: string
  label: string
  type: FormFieldType
  required?: boolean
  options?: string[]
}

@Schema({ timestamps: true })
export class Form {
  @Prop({ required: true })
  title!: string

  @Prop()
  description?: string

  @Prop({ type: [Object], default: [] })
  fields!: FormField[]

  @Prop({ default: true })
  isActive!: boolean
}

export const FormSchema = SchemaFactory.createForClass(Form)
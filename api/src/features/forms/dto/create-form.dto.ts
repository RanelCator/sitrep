// src/features/forms/dto/create-form.dto.ts
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

const fieldTypes = [
  'text',
  'textarea',
  'richtext',
  'number',
  'date',
  'select',
  'checkbox',
  'radio',
] as const

class FormFieldDto {
  @IsString()
  @IsNotEmpty()
  key!: string

  @IsString()
  @IsNotEmpty()
  label!: string

  @IsIn(fieldTypes)
  type!: (typeof fieldTypes)[number]

  @IsOptional()
  @IsBoolean()
  required?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[]
}

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields!: FormFieldDto[]
}
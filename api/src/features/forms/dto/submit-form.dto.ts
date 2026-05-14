// src/features/forms/dto/submit-form.dto.ts
import { IsMongoId, IsNotEmpty, IsObject } from 'class-validator'

export class SubmitFormDto {
  @IsMongoId()
  formId!: string

  @IsObject()
  @IsNotEmpty()
  data!: Record<string, unknown>
}
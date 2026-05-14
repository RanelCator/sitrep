// src/features/forms/forms.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { CreateFormDto } from './dto/create-form.dto'
import { SubmitFormDto } from './dto/submit-form.dto'
import { Form, FormDocument, FormField } from './schemas/form.schema'
import {
  FormSubmission,
  FormSubmissionDocument,
} from './schemas/form-submission.schema'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name)
    private readonly formModel: Model<FormDocument>,

    @InjectModel(FormSubmission.name)
    private readonly submissionModel: Model<FormSubmissionDocument>,
  ) {}

  async createForm(dto: CreateFormDto) {
    const duplicateKeys = this.findDuplicateKeys(dto.fields)

    if (duplicateKeys.length > 0) {
      throw new BadRequestException(
        `Duplicate field keys: ${duplicateKeys.join(', ')}`,
      )
    }

    const form = await this.formModel.create({
      title: dto.title,
      description: dto.description,
      fields: dto.fields,
      isActive: true,
    })

    return {
      message: 'Form created successfully',
      success: true,
      data: form,
    }
  }

  async findForms() {
    const forms = await this.formModel.find().sort({ createdAt: -1 }).lean()

    return {
      message: 'Forms fetched successfully',
      success: true,
      data: forms,
    }
  }

  async findFormById(id: string) {
    const form = await this.formModel.findById(id).lean()

    if (!form) {
      throw new NotFoundException('Form not found')
    }

    return {
      message: 'Form fetched successfully',
      success: true,
      data: form,
    }
  }

  async submitForm(dto: SubmitFormDto, submittedBy?: string) {
    const form = await this.formModel.findById(dto.formId)

    if (!form) {
      throw new NotFoundException('Form not found')
    }

    if (!form.isActive) {
      throw new BadRequestException('Form is inactive')
    }

    this.validateSubmissionData(form.fields, dto.data)

    const submission = await this.submissionModel.create({
      formId: new Types.ObjectId(dto.formId),
      formTitle: form.title,
      data: dto.data,
      submittedBy: submittedBy ? new Types.ObjectId(submittedBy) : undefined,
    })

    return {
      message: 'Form submitted successfully',
      success: true,
      data: submission,
    }
  }

  async findSubmissions(formId?: string) {
    const filter = formId ? { formId: new Types.ObjectId(formId) } : {}

    const submissions = await this.submissionModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean()

    return {
      message: 'Submissions fetched successfully',
      success: true,
      data: submissions,
    }
  }

  private validateSubmissionData(
    fields: FormField[],
    data: Record<string, unknown>,
  ) {
    const allowedKeys = new Set(fields.map((field) => field.key))

    for (const key of Object.keys(data)) {
      if (!allowedKeys.has(key)) {
        throw new BadRequestException(`Unknown field: ${key}`)
      }
    }

    for (const field of fields) {
      const value = data[field.key]

      if (field.required && this.isEmpty(value)) {
        throw new BadRequestException(`${field.label} is required`)
      }

      if (this.isEmpty(value)) {
        continue
      }

      if (field.type === 'number' && typeof value !== 'number') {
        throw new BadRequestException(`${field.label} must be a number`)
      }

      if (
        ['select', 'radio'].includes(field.type) &&
        field.options?.length &&
        !field.options.includes(String(value))
      ) {
        throw new BadRequestException(`${field.label} has an invalid option`)
      }

      if (field.type === 'checkbox' && !Array.isArray(value)) {
        throw new BadRequestException(`${field.label} must be an array`)
      }
    }
  }

  private isEmpty(value: unknown) {
    return value === undefined || value === null || value === ''
  }

  private findDuplicateKeys(fields: { key: string }[]) {
    const seen = new Set<string>()
    const duplicates = new Set<string>()

    for (const field of fields) {
      if (seen.has(field.key)) {
        duplicates.add(field.key)
      }

      seen.add(field.key)
    }

    return [...duplicates]
  }
}
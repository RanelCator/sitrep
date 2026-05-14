// src/features/forms/forms.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { FormsController } from './forms.controller'
import { FormsService } from './forms.service'
import { Form, FormSchema } from './schemas/form.schema'
import {
  FormSubmission,
  FormSubmissionSchema,
} from './schemas/form-submission.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Form.name,
        schema: FormSchema,
      },
      {
        name: FormSubmission.name,
        schema: FormSubmissionSchema,
      },
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
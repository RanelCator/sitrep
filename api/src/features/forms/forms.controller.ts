// src/features/forms/forms.controller.ts
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'

import { FormsService } from './forms.service'
import { CreateFormDto } from './dto/create-form.dto'
import { SubmitFormDto } from './dto/submit-form.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  createForm(@Body() dto: CreateFormDto) {
    return this.formsService.createForm(dto)
  }

  @Get()
  findForms() {
    return this.formsService.findForms()
  }

  @Get(':id')
  findFormById(@Param('id') id: string) {
    return this.formsService.findFormById(id)
  }

  @Post('submit')
  submitForm(@Body() dto: SubmitFormDto, @Req() req: Request) {
    const user = req.user as { userId?: string }

    return this.formsService.submitForm(dto, user.userId)
  }

  @Get('submissions/list')
  findSubmissions(@Query('formId') formId?: string) {
    return this.formsService.findSubmissions(formId)
  }
}
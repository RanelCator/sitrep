// src/features/patient-consultation-referral-form/patient-consultation-referral-form.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PatientConsultationReferralFormService } from './patient-consultation-referral-form.service';
import { CreatePatientConsultationReferralFormDto } from './dto/create-patient-consultation-referral-form.dto';
import { UpdatePatientConsultationReferralFormDto } from './dto/update-patient-consultation-referral-form.dto';
import { QueryPatientConsultationReferralFormDto } from './dto/query-patient-consultation-referral-form.dto';

@Controller('patient-consultation-referral-forms')
export class PatientConsultationReferralFormController {
  constructor(
    private readonly service: PatientConsultationReferralFormService,
  ) {}

  @Post()
  create(@Body() dto: CreatePatientConsultationReferralFormDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryPatientConsultationReferralFormDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientConsultationReferralFormDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('players/:id')
    findPlayerById(@Param('id') id: string) {
    return this.service.findPlayerById(id)
    }
}
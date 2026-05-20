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
  Req,
  UseGuards,
} from '@nestjs/common';

import { PatientConsultationReferralFormService } from './patient-consultation-referral-form.service';
import { CreatePatientConsultationReferralFormDto } from './dto/create-patient-consultation-referral-form.dto';
import { UpdatePatientConsultationReferralFormDto } from './dto/update-patient-consultation-referral-form.dto';
import { QueryPatientConsultationReferralFormDto } from './dto/query-patient-consultation-referral-form.dto';

import type { AuthRequest } from '@/auth/types/auth-request.type'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

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
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() query: QueryPatientConsultationReferralFormDto,
    @Req() req: AuthRequest,
  ) {
    return this.service.findAll(
      query,
      req.user,
    )
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

    // src/features/patient-consultation-referral-form/patient-consultation-referral-form.controller.ts

  @Patch(':id/encoded')
  updateEncodedStatus(
    @Param('id') id: string,
    @Body('isEncoded') isEncoded: boolean,
  ) {
    return this.service.updateEncodedStatus(
      id,
      Boolean(isEncoded),
    )
  }
}
// src/features/reports/reports.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

import { ReportsService } from './reports.service'
import { GenerateDailyReportDto } from './dto/generate-daily-report.dto'
import { FetchGeneratedReportsDto } from './dto/fetch-generated-reports.dto'

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get()
  findAll(@Query() query: FetchGeneratedReportsDto) {
    return this.reportsService.findAll(query)
  }

  @Post('daily/generate')
  generateDaily(@Body() dto: GenerateDailyReportDto) {
    return this.reportsService.generateDailyReport(
      dto.ReportDate,
      dto.ReportCutoff,
    )
  }

  @Get('daily/:date')
  findLatestDaily(@Param('date') date: string) {
    return this.reportsService.findLatestDailyReport(date)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id)
  }
}
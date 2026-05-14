// src/features/reported-incidents/reported-incidents.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import { ReportedIncidentsService } from './reported-incidents.service'
import { CreateReportedIncidentDto } from './dto/create-reported-incident.dto'
import { UpdateReportedIncidentDto } from './dto/update-reported-incident.dto'
import { FetchReportedIncidentsDto } from './dto/fetch-reported-incidents.dto'
import type { AuthRequest } from '@/auth/types/auth-request.type'

@Controller('reported-incidents')
@UseGuards(JwtAuthGuard)
export class ReportedIncidentsController {
  constructor(
    private readonly reportedIncidentsService: ReportedIncidentsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateReportedIncidentDto,
    @Req() req: AuthRequest,
  ) {
    return this.reportedIncidentsService.create(
      dto,
      req.user.userId,
    )
  }

  @Get()
  findAll(@Query() query: FetchReportedIncidentsDto) {
    return this.reportedIncidentsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportedIncidentsService.findOne(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportedIncidentDto) {
    return this.reportedIncidentsService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportedIncidentsService.remove(id)
  }
}
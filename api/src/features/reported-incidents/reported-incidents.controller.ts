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
} from '@nestjs/common'

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import type { AuthRequest } from '@/auth/types/auth-request.type'

import { ReportedIncidentsService } from './reported-incidents.service'
import { CreateReportedIncidentDto } from './dto/create-reported-incident.dto'
import { UpdateReportedIncidentDto } from './dto/update-reported-incident.dto'
import { FetchReportedIncidentsDto } from './dto/fetch-reported-incidents.dto'

@UseGuards(JwtAuthGuard)
@Controller('reported-incidents')
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
      req.user.groupID ?? 0,
    )
  }

  @Get()
  findAll(
    @Query() query: FetchReportedIncidentsDto,
    @Req() req: AuthRequest,
  ) {
    return this.reportedIncidentsService.findAll(
      query,
      req.user.groupID ?? 0,
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportedIncidentsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReportedIncidentDto,
  ) {
    return this.reportedIncidentsService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportedIncidentsService.remove(id)
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { DepedIncidentReportService } from './deped-incident-report.service'
import { CreateDepedIncidentReportDto } from './dto/create-deped-incident-report.dto'
import { UpdateDepedIncidentReportDto } from './dto/update-deped-incident-report.dto'

@Controller('deped-incident-reports')
export class DepedIncidentReportController {
  constructor(
    private readonly depedIncidentReportService: DepedIncidentReportService,
  ) {}

  @Post()
  create(@Body() dto: CreateDepedIncidentReportDto) {
    return this.depedIncidentReportService.create(dto)
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.depedIncidentReportService.findAll(
      Number(page),
      Number(limit),
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depedIncidentReportService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDepedIncidentReportDto,
  ) {
    return this.depedIncidentReportService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depedIncidentReportService.remove(id)
  }
}
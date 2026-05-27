// src/features/billeting-quarters/billeting-quarters.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import type { AuthRequest } from '@/auth/types/auth-request.type'

import { BilletingQuartersService } from './billeting-quarters.service'
import { CreateBilletingQuarterDto } from './dto/create-billeting-quarter.dto'
import { UpdateBilletingQuarterDto } from './dto/update-billeting-quarter.dto'
import { FetchBilletingQuartersDto } from './dto/fetch-billeting-quarters.dto'
import { UpdateArrivalDto } from './dto/update-arrival.dto'
import { UpdateDepartureDto } from './dto/update-departure.dto'

@Controller('billeting-quarters')
@UseGuards(JwtAuthGuard)
export class BilletingQuartersController {
  constructor(
    private readonly billetingQuartersService: BilletingQuartersService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateBilletingQuarterDto,
    @Req() req: AuthRequest,
  ) {
    return this.billetingQuartersService.create(dto, req.user.userId)
  }

  @Get()
  findAll(@Query() query: FetchBilletingQuartersDto) {
    return this.billetingQuartersService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billetingQuartersService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBilletingQuarterDto,
  ) {
    return this.billetingQuartersService.update(id, dto)
  }

  @Patch(':id/status')
  setActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.billetingQuartersService.setActive(id, isActive)
  }

  @Patch(':id/arrival')
  updateArrival(
    @Param('id') id: string,
    @Body() dto: UpdateArrivalDto,
  ) {
    return this.billetingQuartersService.updateArrival(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billetingQuartersService.remove(id)
  }

  @Patch(':id/departure')
  updateDeparture(
    @Param('id') id: string,
    @Body() dto: UpdateDepartureDto,
  ) {
    return this.billetingQuartersService.updateDeparture(
      id,
      dto,
    )
  }
}
// src/features/current-situation/current-situation.controller.ts
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
import type { AuthRequest } from '@/auth/types/auth-request.type'

import { CurrentSituationService } from './current-situation.service'

import { CreateCurrentSituationDto } from './dto/create-current-situation.dto'
import { UpdateCurrentSituationDto } from './dto/update-current-situation.dto'
import { FetchCurrentSituationDto } from './dto/fetch-current-situation.dto'

import { CreateCommitteeDto } from './dto/create-committee.dto'
import { UpdateCommitteeDto } from './dto/update-committee.dto'
import { FetchCommitteeDto } from './dto/fetch-committee.dto'

import { CreateAreaConcernDto } from './dto/create-area-concern.dto'
import { UpdateAreaConcernDto } from './dto/update-area-concern.dto'
import { FetchAreaConcernDto } from './dto/fetch-area-concern.dto'

@Controller('current-situations')
@UseGuards(JwtAuthGuard)
export class CurrentSituationController {
  constructor(
    private readonly currentSituationService: CurrentSituationService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateCurrentSituationDto,
    @Req() req: AuthRequest,
  ) {
    return this.currentSituationService.create(dto, req.user.userId)
  }

  @Get()
  findAll(@Query() query: FetchCurrentSituationDto) {
    return this.currentSituationService.findAll(query)
  }

  @Get('committees')
  findCommittees(@Query() query: FetchCommitteeDto) {
    return this.currentSituationService.findCommittees(query)
  }

  @Post('committees')
  createCommittee(
    @Body() dto: CreateCommitteeDto,
    @Req() req: AuthRequest,
  ) {
    return this.currentSituationService.createCommittee(dto, req.user.userId)
  }

  @Put('committees/:id')
  updateCommittee(
    @Param('id') id: string,
    @Body() dto: UpdateCommitteeDto,
  ) {
    return this.currentSituationService.updateCommittee(id, dto)
  }

  @Delete('committees/:id')
  removeCommittee(@Param('id') id: string) {
    return this.currentSituationService.removeCommittee(id)
  }

  @Get('area-concerns')
  findAreaConcerns(@Query() query: FetchAreaConcernDto) {
    return this.currentSituationService.findAreaConcerns(query)
  }

  @Post('area-concerns')
  createAreaConcern(
    @Body() dto: CreateAreaConcernDto,
    @Req() req: AuthRequest,
  ) {
    return this.currentSituationService.createAreaConcern(
      dto,
      req.user.userId,
    )
  }

  @Put('area-concerns/:id')
  updateAreaConcern(
    @Param('id') id: string,
    @Body() dto: UpdateAreaConcernDto,
  ) {
    return this.currentSituationService.updateAreaConcern(id, dto)
  }

  @Delete('area-concerns/:id')
  removeAreaConcern(@Param('id') id: string) {
    return this.currentSituationService.removeAreaConcern(id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currentSituationService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCurrentSituationDto,
  ) {
    return this.currentSituationService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currentSituationService.remove(id)
  }
}
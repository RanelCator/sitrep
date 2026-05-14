// src/features/other-delegation/other-delegation.controller.ts
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

import { OtherDelegationService } from './other-delegation.service'
import { CreateOtherDelegationDto } from './dto/create-other-delegation.dto'
import { UpdateOtherDelegationDto } from './dto/update-other-delegation.dto'
import { FetchOtherDelegationDto } from './dto/fetch-other-delegation.dto'

@Controller('other-delegation')
@UseGuards(JwtAuthGuard)
export class OtherDelegationController {
  constructor(
    private readonly otherDelegationService: OtherDelegationService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateOtherDelegationDto,
    @Req() req: AuthRequest,
  ) {
    return this.otherDelegationService.create(dto, req.user.userId)
  }

  @Get()
  findAll(@Query() query: FetchOtherDelegationDto) {
    return this.otherDelegationService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherDelegationService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOtherDelegationDto,
  ) {
    return this.otherDelegationService.update(id, dto)
  }

  @Patch(':id/status')
  setActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.otherDelegationService.setActive(id, isActive)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otherDelegationService.remove(id)
  }
}
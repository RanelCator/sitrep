// src/features/other-information/other-information.controller.ts
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

import { OtherInformationService } from './other-information.service'
import { CreateOtherInformationDto } from './dto/create-other-information.dto'
import { UpdateOtherInformationDto } from './dto/update-other-information.dto'
import { FetchOtherInformationDto } from './dto/fetch-other-information.dto'

@Controller('other-information')
@UseGuards(JwtAuthGuard)
export class OtherInformationController {
  constructor(
    private readonly otherInformationService: OtherInformationService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateOtherInformationDto,
    @Req() req: AuthRequest,
  ) {
    return this.otherInformationService.create(
      dto,
      req.user.userId,
    )
  }

  @Get()
  findAll(@Query() query: FetchOtherInformationDto) {
    return this.otherInformationService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherInformationService.findOne(id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOtherInformationDto,
  ) {
    return this.otherInformationService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otherInformationService.remove(id)
  }
}
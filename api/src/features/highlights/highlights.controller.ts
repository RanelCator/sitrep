// src/features/highlights/highlights.controller.ts
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
import type { Request } from 'express'

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import { HighlightsService } from './highlights.service'
import { CreateHighlightDto } from './dto/create-highlight.dto'
import { UpdateHighlightDto } from './dto/update-highlight.dto'
import { FetchHighlightsDto } from './dto/fetch-highlights.dto'

@Controller('highlights')
@UseGuards(JwtAuthGuard)
export class HighlightsController {
  constructor(private readonly highlightsService: HighlightsService) {}

  @Post()
  create(@Body() dto: CreateHighlightDto, @Req() req: Request) {
    const user = req.user as { userId: string }

    return this.highlightsService.create(dto, user.userId)
  }

  @Get()
  findAll(@Query() query: FetchHighlightsDto) {
    return this.highlightsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.highlightsService.findOne(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHighlightDto) {
    return this.highlightsService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.highlightsService.remove(id)
  }
}
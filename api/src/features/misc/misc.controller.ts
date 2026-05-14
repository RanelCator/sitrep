// src/features/misc/misc.controller.ts
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import { MiscService } from './misc.service'
import { UpdateMiscDto } from './dto/update-misc.dto'

@Controller('misc')
@UseGuards(JwtAuthGuard)
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get()
  findOne() {
    return this.miscService.findOne()
  }

  @Patch()
  update(@Body() dto: UpdateMiscDto, @Req() req: Request) {
    const user = req.user as { userId?: string }

    return this.miscService.update(dto, user.userId)
  }
}
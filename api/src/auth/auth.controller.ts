import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import type { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { ArsLoginDto } from './dto/ars-login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res)
  }

  @Post('ars-login')
  arsLogin(
    @Body() dto: ArsLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.arsLogin(dto.id, res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return this.authService.me(req.user)
  }

  @Post('logout')
  logout(
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(res)
  }
}
// src/auth/strategies/jwt-refresh.strategy.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'
import type { StrategyOptionsWithRequest } from 'passport-jwt'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token ?? null
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    }

    super(options)
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies?.refresh_token ?? null

    return {
      sub: payload.sub,
      tokenId: payload.tokenId,
      refreshToken,
    }
  }
}
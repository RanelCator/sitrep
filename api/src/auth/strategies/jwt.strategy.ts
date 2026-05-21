import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import type { Request } from 'express'

function extractTokenFromCookie(req: Request) {
  return req?.cookies?.access_token ?? null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractTokenFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    })
  }

  validate(payload: any) {
    return {
      userId: payload.sub,
      sqlServerUserId: payload.sqlServerUserId,
      username: payload.username,
      name: payload.name,
      role: payload.role,

      regionID: payload.regionID ?? 0,
      groupID: payload.groupID ?? 0,
      arsIds: payload.arsIds ?? [],

      permissions: payload.permissions ?? [],
    }
  }
}
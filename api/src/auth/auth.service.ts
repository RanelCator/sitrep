// src/auth/auth.service.ts

import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { Response } from 'express'
import type { StringValue } from 'ms'

import { LoginDto } from './dto/login.dto'
import { User, UserDocument } from '@/auth/schema/user.schema'
import { SqlServerAuthService } from '@/sql-server/sql-server-auth.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly sqlServerAuthService: SqlServerAuthService,
  ) {}

  async login(dto: LoginDto, res: Response) {
    const sqlUser = await this.sqlServerAuthService.validateUser(
      dto.username,
      dto.password,
    )

    if (!sqlUser) {
      throw new UnauthorizedException('Invalid username or password')
    }

    if (!sqlUser.isActive) {
      throw new ForbiddenException('Account is inactive')
    }

    const user = await this.findOrCreateMongoUser({
      sqlServerUserId: String(sqlUser.id),
      username: sqlUser.username,
      name: sqlUser.name,
      regionID: sqlUser.regionID,
    })

    const token = await this.generateAccessToken(user)

    this.setAuthCookie(res, token)

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: this.toAuthUser(user),
      },
    }
  }

  async arsLogin(id: number, res: Response) {
    const sqlUser =
      await this.sqlServerAuthService.findArsUserById(id)

    if (!sqlUser) {
      throw new UnauthorizedException(
        'User has no ARS access or does not exist.',
      )
    }

    const user = await this.findOrCreateMongoUser({
      sqlServerUserId: String(sqlUser.id),
      username: sqlUser.username,
      name: sqlUser.name,
      regionID: sqlUser.region,
    })

    const token = await this.generateAccessToken(user)

    this.setAuthCookie(res, token)

    return {
      success: true,
      message: 'ARS login successful',
      data: {
        user: this.toAuthUser(user),
      },
    }
  }

  async me(userPayload: any) {
    const user = await this.userModel.findById(userPayload.sub)

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid session')
    }

    return {
      success: true,
      message: 'Authenticated user fetched successfully',
      data: {
        user: this.toAuthUser(user),
      },
    }
  }

  async logout(res: Response) {
    this.clearAuthCookie(res)

    return {
      success: true,
      message: 'Logout successful',
    }
  }

  private async findOrCreateMongoUser(payload: {
    sqlServerUserId: string
    username: string
    name: string
    regionID?: number
  }) {
    let user = await this.userModel.findOne({
      sqlServerUserId: payload.sqlServerUserId,
    })

    if (!user) {
      user = await this.userModel.create({
        sqlServerUserId: payload.sqlServerUserId,
        username: payload.username,
        name: payload.name,
        role: 'encoder',
        isActive: true,
        regionID: payload.regionID,
        lastLoginAt: new Date(),
      })
    } else {
      user.username = payload.username
      user.name = payload.name
      user.regionID = payload.regionID
      user.lastLoginAt = new Date()

      await user.save()
    }

    if (!user.isActive) {
      throw new ForbiddenException('SITREP account is inactive')
    }

    return user
  }

  private async generateAccessToken(user: UserDocument) {
    console.log("GENERATING TOKEN REGION:", user.regionID)
    return this.jwtService.signAsync(
      {
        sub: user.id,
        sqlServerUserId: user.sqlServerUserId,
        username: user.username,
        name: user.name,
        role: user.role,
        regionID: user.regionID,
        permissions: [],
      },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.getOrThrow<StringValue>(
          'JWT_ACCESS_EXPIRES_IN',
        ),
      },
    )
  }

  // private getCookieOptions() {
  //   const isProduction =
  //     this.config.get<string>('NODE_ENV') === 'production'

  //   return {
  //     httpOnly: true,
  //     secure: isProduction,
  //     sameSite: isProduction ? ('none' as const) : ('lax' as const),
  //     domain: isProduction
  //       ? this.config.get<string>('COOKIE_DOMAIN') || undefined
  //       : undefined,
  //     path: '/',
  //   }
  // }

  private getCookieOptions() {
    const isProduction =
      this.config.get<string>('NODE_ENV') === 'production'

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      domain: isProduction
        ? this.config.get<string>('COOKIE_DOMAIN') || undefined
        : undefined,
      path: '/',

      // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  }

  private setAuthCookie(res: Response, accessToken: string) {
    res.cookie(
      'access_token',
      accessToken,
      this.getCookieOptions(),
    )
  }

  private clearAuthCookie(res: Response) {
    res.clearCookie(
      'access_token',
      this.getCookieOptions(),
    )
  }

  private toAuthUser(user: UserDocument) {
    return {
      userId: user.id,
      sqlServerUserId: user.sqlServerUserId,
      username: user.username,
      name: user.name,
      role: user.role,
      regionID: user.regionID,
      isActive: user.isActive,
    }
  }
}
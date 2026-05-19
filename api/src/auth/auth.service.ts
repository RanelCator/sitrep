// src/auth/auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
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

    let user = await this.userModel.findOne({
      sqlServerUserId: String(sqlUser.id),
    })

    if (!user) {
      user = await this.userModel.create({
        sqlServerUserId: String(sqlUser.id),
        username: sqlUser.username,
        name: sqlUser.name,
        role: 'encoder',
        isActive: true,
        lastLoginAt: new Date(),
      })
    }

    if (!user.isActive) {
      throw new ForbiddenException('SITREP account is inactive')
    }

    const tokens = await this.generateTokens(user)

    await this.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      tokens.refreshTokenId,
    )

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    await this.userModel.findByIdAndUpdate(user.id, {
      lastLoginAt: new Date(),
    })

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

    let user = await this.userModel.findOne({
      sqlServerUserId: String(sqlUser.id),
    })

    if (!user) {
      user = await this.userModel.create({
        sqlServerUserId: String(sqlUser.id),
        username: sqlUser.username,
        name: sqlUser.name,
        role: 'encoder',
        isActive: true,
        lastLoginAt: new Date(),
      })
    } else {
      user.username = sqlUser.username
      user.name = sqlUser.name
      user.lastLoginAt = new Date()

      await user.save()
    }

    if (!user.isActive) {
      throw new ForbiddenException('SITREP account is inactive')
    }

    const tokens = await this.generateTokens(user)

    await this.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      tokens.refreshTokenId,
    )

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return {
      success: true,
      message: 'ARS login successful',
      data: {
        user: this.toAuthUser(user),
      },
    }
  }

  async refresh(userPayload: any, res: Response) {
    const user = await this.userModel.findById(userPayload.sub)

    if (!user || !user.refreshTokenHash || !user.refreshTokenId) {
      throw new UnauthorizedException('Invalid refresh session')
    }

    if (user.refreshTokenId !== userPayload.tokenId) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const isValidRefreshToken = await bcrypt.compare(
      userPayload.refreshToken,
      user.refreshTokenHash,
    )

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const tokens = await this.generateTokens(user)

    await this.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      tokens.refreshTokenId,
    )

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return {
      success: true,
      message: 'Token refreshed',
    }
  }

  async logout(userPayload: any, res: Response) {
    await this.userModel.findByIdAndUpdate(userPayload.userId, {
      $unset: {
        refreshTokenHash: '',
        refreshTokenId: '',
      },
    })

    this.clearAuthCookies(res)

    return {
      success: true,
      message: 'Logout successful',
    }
  }

  private async generateTokens(user: UserDocument) {
    const refreshTokenId = randomUUID()

    const accessPayload = {
      sub: user.id,
      sqlServerUserId: user.sqlServerUserId,
      username: user.username,
      name: user.name,
      role: user.role,
      permissions: [],
    }

    const refreshPayload = {
      sub: user.id,
      tokenId: refreshTokenId,
    }

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.getOrThrow<StringValue>(
        'JWT_ACCESS_EXPIRES_IN',
      ),
    })

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.getOrThrow<StringValue>(
        'JWT_REFRESH_EXPIRES_IN',
      ),
    })

    return {
      accessToken,
      refreshToken,
      refreshTokenId,
    }
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
    refreshTokenId: string,
  ) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12)

    await this.userModel.findByIdAndUpdate(userId, {
      refreshTokenHash,
      refreshTokenId,
      lastLoginAt: new Date(),
    })
  }

  private getCookieDomain() {
    const isProduction =
      this.config.get<string>('NODE_ENV') === 'production'

    if (!isProduction) {
      return undefined
    }

    return this.config.get<string>('COOKIE_DOMAIN') || undefined
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isHttps =
      this.config.get<string>('COOKIE_SECURE') === 'true'

    const cookieDomain = this.getCookieDomain()

    const cookieOptions = {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? ('none' as const) : ('lax' as const),
      domain: cookieDomain,
      path: '/',
    }

    res.cookie('access_token', accessToken, cookieOptions)
    res.cookie('refresh_token', refreshToken, cookieOptions)
  }

  private clearAuthCookies(res: Response) {
    const isHttps =
      this.config.get<string>('COOKIE_SECURE') === 'true'

    const cookieDomain = this.getCookieDomain()

    const cookieOptions = {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? ('none' as const) : ('lax' as const),
      domain: cookieDomain,
      path: '/',
    }

    res.clearCookie('access_token', cookieOptions)
    res.clearCookie('refresh_token', cookieOptions)
  }

  private toAuthUser(user: UserDocument) {
    return {
      userId: user.id,
      sqlServerUserId: user.sqlServerUserId,
      username: user.username,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    }
  }
}
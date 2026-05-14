import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import type { JwtModuleOptions } from '@nestjs/jwt'
import type { StringValue } from 'ms'
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/auth.service'

import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@/auth/strategies/jwt-refresh.strategy'
import { JwtRefreshGuard } from '@/auth/guards/jwt-refresh.guard'
import { RefreshTokenStrategy } from '@/auth/strategies/refresh-token.strategy'
import { SqlServerAuthModule } from '@/sql-server/sql-server-auth.module'
import { User, UserSchema } from '@/auth/schema/user.schema'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    SqlServerAuthModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<StringValue>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    JwtRefreshStrategy,
    JwtRefreshGuard,
    RefreshTokenStrategy],
})
export class AuthModule {}
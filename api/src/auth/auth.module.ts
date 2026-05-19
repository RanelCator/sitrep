import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'

import {
  User,
  UserSchema,
} from '@/auth/schema/user.schema'
import { SqlServerAuthModule } from '@/sql-server/sql-server-auth.module'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    SqlServerAuthModule,

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
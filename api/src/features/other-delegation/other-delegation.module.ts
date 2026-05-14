// src/features/other-delegation/other-delegation.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OtherDelegationController } from './other-delegation.controller'
import { OtherDelegationService } from './other-delegation.service'
import {
  OtherDelegation,
  OtherDelegationSchema,
} from './schemas/other-delegation.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OtherDelegation.name,
        schema: OtherDelegationSchema,
      },
    ]),
  ],
  controllers: [OtherDelegationController],
  providers: [OtherDelegationService],
})
export class OtherDelegationModule {}
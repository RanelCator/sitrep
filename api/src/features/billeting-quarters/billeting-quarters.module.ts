// src/features/billeting-quarters/billeting-quarters.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BilletingQuartersController } from './billeting-quarters.controller'
import { BilletingQuartersService } from './billeting-quarters.service'
import {
  BilletingQuarter,
  BilletingQuarterSchema,
} from './schemas/billeting-quarter.schema'
import { DelegationArrivalLog, DelegationArrivalLogSchema } from './schemas/delegation-arrival-log.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BilletingQuarter.name,
        schema: BilletingQuarterSchema,
      },
      {
        name: DelegationArrivalLog.name,
        schema: DelegationArrivalLogSchema,
      },
    ]),
  ],
  controllers: [BilletingQuartersController],
  providers: [BilletingQuartersService],
})
export class BilletingQuartersModule {}
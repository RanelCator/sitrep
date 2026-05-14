// src/features/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'

import {
  BilletingQuarter,
  BilletingQuarterSchema,
} from '@/features/billeting-quarters/schemas/billeting-quarter.schema'

import {
  Misc,
  MiscSchema,
} from '@/features/misc/schemas/misc.schema'

import {
  Highlight,
  HighlightSchema,
} from '@/features/highlights/schemas/highlight.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BilletingQuarter.name,
        schema: BilletingQuarterSchema,
      },

      {
        name: Misc.name,
        schema: MiscSchema,
      },

      {
        name: Highlight.name,
        schema: HighlightSchema,
      },
    ]),
  ],

  controllers: [DashboardController],

  providers: [DashboardService],
})
export class DashboardModule {}
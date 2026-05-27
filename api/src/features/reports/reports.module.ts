// src/features/reports/reports.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'

import {
  GeneratedReport,
  GeneratedReportSchema,
} from './schemas/generated-report.schema'

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

import {
  CurrentSituation,
  CurrentSituationSchema,
} from '@/features/current-situation/schemas/current-situation.schema'

import {
  ReportedIncident,
  ReportedIncidentSchema,
} from '@/features/reported-incidents/schemas/reported-incident.schema'

import {
  OtherInformation,
  OtherInformationSchema,
} from '@/features/other-information/schemas/other-information.schema'

import {
  OtherDelegation,
  OtherDelegationSchema,
} from '@/features/other-delegation/schemas/other-delegation.schema'

import {
  DepedIncidentReport,
  DepedIncidentReportSchema,
} from '@/features/deped-incident-report/schema/deped-incident-report.schema'

import {
  WeatherUpdate,
  WeatherUpdateSchema,
} from '@/features/weather-updates/schemas/weather-update.schema'
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GeneratedReport.name,
        schema: GeneratedReportSchema,
      },

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

      {
        name: CurrentSituation.name,
        schema: CurrentSituationSchema,
      },

      {
        name: ReportedIncident.name,
        schema: ReportedIncidentSchema,
      },

      {
        name: OtherInformation.name,
        schema: OtherInformationSchema,
      },

      {
        name: OtherDelegation.name,
        schema: OtherDelegationSchema,
      },
      {
  name: DepedIncidentReport.name,
  schema: DepedIncidentReportSchema,
},
{
  name: WeatherUpdate.name,
  schema: WeatherUpdateSchema,
},
    ]),
  ],

  controllers: [ReportsController],

  providers: [ReportsService],
})
export class ReportsModule {}
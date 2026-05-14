// src/features/reported-incidents/reported-incidents.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ReportedIncidentsController } from './reported-incidents.controller'
import { ReportedIncidentsService } from './reported-incidents.service'
import {
  ReportedIncident,
  ReportedIncidentSchema,
} from './schemas/reported-incident.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ReportedIncident.name,
        schema: ReportedIncidentSchema,
      },
    ]),
  ],
  controllers: [ReportedIncidentsController],
  providers: [ReportedIncidentsService],
})
export class ReportedIncidentsModule {}
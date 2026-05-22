import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { DepedIncidentReportController } from './deped-incident-report.controller';
import { DepedIncidentReportService } from './deped-incident-report.service';
import { DepedIncidentReport, DepedIncidentReportSchema } from './schema/deped-incident-report.schema';

@Module({
   imports: [
    MongooseModule.forFeature([
      {
        name: DepedIncidentReport.name,
        schema: DepedIncidentReportSchema,
      },
    ]),
  ],
  controllers: [DepedIncidentReportController],
  providers: [DepedIncidentReportService]
})
export class DepedIncidentReportModule {}

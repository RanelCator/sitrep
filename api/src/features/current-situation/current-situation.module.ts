// src/features/current-situation/current-situation.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CurrentSituationController } from './current-situation.controller'
import { CurrentSituationService } from './current-situation.service'
import {
  CurrentSituation,
  CurrentSituationSchema,
} from './schemas/current-situation.schema'
import { AreaConcern, AreaConcernSchema } from './schemas/area-concern.schema'
import { Committee, CommitteeSchema } from './schemas/committee.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CurrentSituation.name,
        schema: CurrentSituationSchema,
      },
      {
        name: Committee.name,
        schema: CommitteeSchema,
      },
      {
        name: AreaConcern.name,
        schema: AreaConcernSchema,
      },
    ]),
  ],
  controllers: [CurrentSituationController],
  providers: [CurrentSituationService],
})
export class CurrentSituationModule {}
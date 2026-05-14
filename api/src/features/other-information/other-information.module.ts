// src/features/other-information/other-information.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OtherInformationController } from './other-information.controller'
import { OtherInformationService } from './other-information.service'

import {
  OtherInformation,
  OtherInformationSchema,
} from './schemas/other-information.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OtherInformation.name,
        schema: OtherInformationSchema,
      },
    ]),
  ],
  controllers: [OtherInformationController],
  providers: [OtherInformationService],
})
export class OtherInformationModule {}
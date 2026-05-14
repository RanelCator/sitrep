// src/features/misc/misc.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MiscController } from './misc.controller'
import { MiscService } from './misc.service'
import { Misc, MiscSchema } from './schemas/misc.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Misc.name,
        schema: MiscSchema,
      },
    ]),
  ],
  controllers: [MiscController],
  providers: [MiscService],
})
export class MiscModule {}
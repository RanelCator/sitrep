// src/features/highlights/highlights.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { HighlightsController } from './highlights.controller'
import { HighlightsService } from './highlights.service'
import { Highlight, HighlightSchema } from './schemas/highlight.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Highlight.name,
        schema: HighlightSchema,
      },
    ]),
  ],
  controllers: [HighlightsController],
  providers: [HighlightsService],
})
export class HighlightsModule {}
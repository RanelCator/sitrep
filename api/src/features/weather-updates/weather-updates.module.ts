import { Module } from '@nestjs/common';
import { WeatherUpdatesService } from './weather-updates.service';
import { WeatherUpdatesController } from './weather-updates.controller';
import { WeatherUpdate, WeatherUpdateSchema } from './schemas/weather-update.schema';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
   imports: [
    MongooseModule.forFeature([
      {
        name: WeatherUpdate.name,
        schema: WeatherUpdateSchema,
      },
    ]),
  ],
  providers: [WeatherUpdatesService],
  controllers: [WeatherUpdatesController]
})
export class WeatherUpdatesModule {}

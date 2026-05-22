import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator'
import {
  WEATHER_WARNING_LEVELS,
  type WeatherWarningLevel,
} from '../schemas/weather-update.schema'

export class CreateWeatherUpdateDto {
  @IsString()
  place!: string

  @IsDateString()
  date!: string

  @IsString()
  temperature!: string

  @IsIn(Object.values(WEATHER_WARNING_LEVELS))
  warningLevel!: WeatherWarningLevel

  @IsOptional()
  @IsString()
  description?: string
}
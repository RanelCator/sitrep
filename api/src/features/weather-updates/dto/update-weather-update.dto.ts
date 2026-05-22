import { PartialType } from '@nestjs/mapped-types'
import { CreateWeatherUpdateDto } from './create-weather-update.dto'

export class UpdateWeatherUpdateDto extends PartialType(
  CreateWeatherUpdateDto,
) {}
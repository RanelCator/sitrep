import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { WeatherUpdatesService } from './weather-updates.service'

import { CreateWeatherUpdateDto } from './dto/create-weather-update.dto'
import { UpdateWeatherUpdateDto } from './dto/update-weather-update.dto'

@Controller('weather-updates')
export class WeatherUpdatesController {
  constructor(
    private readonly weatherUpdatesService: WeatherUpdatesService,
  ) {}

  @Post()
  create(@Body() dto: CreateWeatherUpdateDto) {
    return this.weatherUpdatesService.create(dto)
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.weatherUpdatesService.findAll(
      Number(page),
      Number(limit),
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weatherUpdatesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWeatherUpdateDto,
  ) {
    return this.weatherUpdatesService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weatherUpdatesService.remove(id)
  }
}
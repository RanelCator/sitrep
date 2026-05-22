import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  WeatherUpdate,
  WeatherUpdateDocument,
} from './schemas/weather-update.schema'

import { CreateWeatherUpdateDto } from './dto/create-weather-update.dto'
import { UpdateWeatherUpdateDto } from './dto/update-weather-update.dto'

@Injectable()
export class WeatherUpdatesService {
  constructor(
    @InjectModel(WeatherUpdate.name)
    private readonly weatherUpdateModel: Model<WeatherUpdateDocument>,
  ) {}

  async create(dto: CreateWeatherUpdateDto) {
    const item = await this.weatherUpdateModel.create(dto)

    return {
      success: true,
      message: 'Weather update created successfully.',
      data: item,
    }
  }

  async findAll(page = 1, limit = 10) {
    const safePage = Math.max(Number(page) || 1, 1)
    const safeLimit = Math.max(Number(limit) || 10, 1)

    const skip = (safePage - 1) * safeLimit

    const [items, total] = await Promise.all([
      this.weatherUpdateModel
        .find()
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(safeLimit)
        .lean(),

      this.weatherUpdateModel.countDocuments(),
    ])

    return {
      success: true,
      message: 'Weather updates retrieved successfully.',
      data: {
        items,
        meta: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    }
  }

  async findOne(id: string) {
    const item =
      await this.weatherUpdateModel.findById(id).lean()

    if (!item) {
      throw new NotFoundException(
        'Weather update not found.',
      )
    }

    return {
      success: true,
      message: 'Weather update retrieved successfully.',
      data: item,
    }
  }

  async update(
    id: string,
    dto: UpdateWeatherUpdateDto,
  ) {
    const item =
      await this.weatherUpdateModel.findByIdAndUpdate(
        id,
        dto,
        {
          new: true,
          runValidators: true,
        },
      )

    if (!item) {
      throw new NotFoundException(
        'Weather update not found.',
      )
    }

    return {
      success: true,
      message: 'Weather update updated successfully.',
      data: item,
    }
  }

  async remove(id: string) {
    const item =
      await this.weatherUpdateModel.findByIdAndDelete(
        id,
      )

    if (!item) {
      throw new NotFoundException(
        'Weather update not found.',
      )
    }

    return {
      success: true,
      message: 'Weather update deleted successfully.',
      data: item,
    }
  }
}
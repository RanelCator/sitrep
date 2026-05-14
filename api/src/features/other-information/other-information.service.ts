// src/features/other-information/other-information.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  OtherInformation,
  OtherInformationDocument,
} from './schemas/other-information.schema'

import { CreateOtherInformationDto } from './dto/create-other-information.dto'
import { UpdateOtherInformationDto } from './dto/update-other-information.dto'
import { FetchOtherInformationDto } from './dto/fetch-other-information.dto'

@Injectable()
export class OtherInformationService {
  constructor(
    @InjectModel(OtherInformation.name)
    private readonly otherInformationModel: Model<OtherInformationDocument>,
  ) {}

  async create(dto: CreateOtherInformationDto, userId: string) {
    const created = await this.otherInformationModel.create({
      ...dto,
      AddedBy: new Types.ObjectId(userId),
    })

    return {
      success: true,
      message: 'Other information created successfully',
      data: created,
    }
  }

  async findAll(query: FetchOtherInformationDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const search = query.search?.trim()
    const sortBy = query.sortBy ?? 'DateTimeEntered'
    const sortOrder = query.sortOrder ?? 'desc'

    const filter: Record<string, any> = {}

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    }

    const [items, total] = await Promise.all([
      this.otherInformationModel
        .find(filter)
        .populate('AddedBy', 'name username role')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.otherInformationModel.countDocuments(filter),
    ])

    return {
      success: true,
      message: 'Other information fetched successfully',
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const data = await this.otherInformationModel
      .findById(id)
      .populate('AddedBy', 'name username role')
      .lean()

    if (!data) {
      throw new NotFoundException('Other information not found')
    }

    return {
      success: true,
      message: 'Other information fetched successfully',
      data,
    }
  }

  async update(id: string, dto: UpdateOtherInformationDto) {
    const updated = await this.otherInformationModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException('Other information not found')
    }

    return {
      success: true,
      message: 'Other information updated successfully',
      data: updated,
    }
  }

  async remove(id: string) {
    const deleted = await this.otherInformationModel.findByIdAndDelete(id)

    if (!deleted) {
      throw new NotFoundException('Other information not found')
    }

    return {
      success: true,
      message: 'Other information deleted successfully',
    }
  }
}
// src/features/highlights/highlights.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Highlight, HighlightDocument } from './schemas/highlight.schema'
import { CreateHighlightDto } from './dto/create-highlight.dto'
import { UpdateHighlightDto } from './dto/update-highlight.dto'
import { FetchHighlightsDto } from './dto/fetch-highlights.dto'

@Injectable()
export class HighlightsService {
  constructor(
    @InjectModel(Highlight.name)
    private readonly highlightModel: Model<HighlightDocument>,
  ) {}

  async create(dto: CreateHighlightDto, userId: string) {
    // const entryDate = this.toEntryDate(dto.DateTimeEntered)

    const DateTimeEntered = this.normalizeDateOnly(dto.DateTimeEntered)
    const entryDate = this.toEntryDate(dto.DateTimeEntered)

    const highlight = await this.highlightModel.findOneAndUpdate(
      { entryDate },
      {
        DateTimeEntered,
        entryDate,
        description: dto.description,
        AddedBy: new Types.ObjectId(userId),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    )

    return {
      success: true,
      message: 'Highlight saved successfully',
      data: highlight,
    }
  }

  async findAll(query: FetchHighlightsDto) {
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
        { entryDate: { $regex: search, $options: 'i' } },
      ]
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    }

    const [items, total] = await Promise.all([
      this.highlightModel
        .find(filter)
        .populate('AddedBy', 'name username role')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.highlightModel.countDocuments(filter),
    ])

    return {
      success: true,
      message: 'Highlights fetched successfully',
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
    const highlight = await this.highlightModel
      .findById(id)
      .populate('AddedBy', 'name username role')
      .lean()

    if (!highlight) {
      throw new NotFoundException('Highlight not found')
    }

    return {
      success: true,
      message: 'Highlight fetched successfully',
      data: highlight,
    }
  }

  async update(id: string, dto: UpdateHighlightDto) {
    const updateData: Record<string, any> = { ...dto }

    if (dto.DateTimeEntered) {
      updateData.entryDate = this.toEntryDate(dto.DateTimeEntered)
    }

    const updated = await this.highlightModel.findByIdAndUpdate(id, updateData, {
      new: true,
    })

    if (!updated) {
      throw new NotFoundException('Highlight not found')
    }

    return {
      success: true,
      message: 'Highlight updated successfully',
      data: updated,
    }
  }

  async remove(id: string) {
    const deleted = await this.highlightModel.findByIdAndDelete(id)

    if (!deleted) {
      throw new NotFoundException('Highlight not found')
    }

    return {
      success: true,
      message: 'Highlight deleted successfully',
    }
  }

  private normalizeDateOnly(date: Date) {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)

    return normalized
  }

  private toEntryDate(date: Date) {
    return this.normalizeDateOnly(date).toISOString().split('T')[0]
  }
}
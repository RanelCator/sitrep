// src/features/other-delegation/other-delegation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  OtherDelegation,
  OtherDelegationDocument,
} from './schemas/other-delegation.schema'
import { CreateOtherDelegationDto } from './dto/create-other-delegation.dto'
import { UpdateOtherDelegationDto } from './dto/update-other-delegation.dto'
import { FetchOtherDelegationDto } from './dto/fetch-other-delegation.dto'

@Injectable()
export class OtherDelegationService {
  constructor(
    @InjectModel(OtherDelegation.name)
    private readonly otherDelegationModel: Model<OtherDelegationDocument>,
  ) {}

  async create(dto: CreateOtherDelegationDto, userId: string) {
    const created = await this.otherDelegationModel.create({
      ...dto,
      AddedBy: new Types.ObjectId(userId),
    })

    return {
      success: true,
      message: 'Other delegation created successfully',
      data: created,
    }
  }

  async findAll(query: FetchOtherDelegationDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const search = query.search?.trim()
    const sortBy = query.sortBy ?? 'createdAt'
    const sortOrder = query.sortOrder ?? 'desc'

    const filter: Record<string, any> = {}

    if (search) {
      filter.$or = [
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
      ]
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    }

    const [items, total] = await Promise.all([
      this.otherDelegationModel
        .find(filter)
        .populate('AddedBy', 'name username role')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.otherDelegationModel.countDocuments(filter),
    ])

    return {
      success: true,
      message: 'Other delegations fetched successfully',
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
    const data = await this.otherDelegationModel
      .findById(id)
      .populate('AddedBy', 'name username role')
      .lean()

    if (!data) {
      throw new NotFoundException('Other delegation not found')
    }

    return {
      success: true,
      message: 'Other delegation fetched successfully',
      data,
    }
  }

  async update(id: string, dto: UpdateOtherDelegationDto) {
    const updated = await this.otherDelegationModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException('Other delegation not found')
    }

    return {
      success: true,
      message: 'Other delegation updated successfully',
      data: updated,
    }
  }

  async setActive(id: string, isActive: boolean) {
    const updated = await this.otherDelegationModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException('Other delegation not found')
    }

    return {
      success: true,
      message: 'Other delegation status updated successfully',
      data: updated,
    }
  }

  async remove(id: string) {
    const deleted = await this.otherDelegationModel.findByIdAndDelete(id)

    if (!deleted) {
      throw new NotFoundException('Other delegation not found')
    }

    return {
      success: true,
      message: 'Other delegation deleted successfully',
    }
  }
}
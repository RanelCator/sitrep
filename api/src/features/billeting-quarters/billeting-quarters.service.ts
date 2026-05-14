// src/features/billeting-quarters/billeting-quarters.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  BilletingQuarter,
  BilletingQuarterDocument,
} from './schemas/billeting-quarter.schema'
import { CreateBilletingQuarterDto } from './dto/create-billeting-quarter.dto'
import { UpdateBilletingQuarterDto } from './dto/update-billeting-quarter.dto'
import { FetchBilletingQuartersDto } from './dto/fetch-billeting-quarters.dto'
import { UpdateArrivalDto } from './dto/update-arrival.dto'
import { DelegationArrivalLog, DelegationArrivalLogDocument } from './schemas/delegation-arrival-log.schema'

@Injectable()
export class BilletingQuartersService {
  constructor(
    @InjectModel(BilletingQuarter.name)
    private readonly billetingQuarterModel: Model<BilletingQuarterDocument>,

    @InjectModel(DelegationArrivalLog.name)
    private readonly delegationArrivalLogModel: Model<DelegationArrivalLogDocument>,
  ) {}

async create(dto: CreateBilletingQuarterDto, userId: string) {
    const created = await this.billetingQuarterModel.create({
        ...dto,
        AddedBy: new Types.ObjectId(userId),
    })

    return {
        success: true,
        message: 'Billeting quarter created successfully',
        data: created,
    }
}

async findAll(query: FetchBilletingQuartersDto) {
  const page = query.page ?? 1
  const limit = query.limit ?? 10
  const skip = (page - 1) * limit

  const search = query.search?.trim()
  const sortBy = query.sortBy ?? 'createdAt'
  const sortOrder = 'asc'

  const filter: Record<string, any> = {}

  if (search) {
    filter.$or = [
      { Billeting_Quarters: { $regex: search, $options: 'i' } },
      { Delegation: { $regex: search, $options: 'i' } },
    ]
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  }

  const [items, total] = await Promise.all([
    this.billetingQuarterModel
      .find(filter)
      .populate('AddedBy', 'name username role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    this.billetingQuarterModel.countDocuments(filter),
  ])

  return {
    success: true,
    message: 'Billeting quarters fetched successfully',
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
    const data = await this.billetingQuarterModel
      .findById(id)
      .populate('AddedBy', 'name username role')
      .lean()

    if (!data) {
      throw new NotFoundException('Billeting quarter not found')
    }

    return {
      success: true,
      message: 'Billeting quarter fetched successfully',
      data,
    }
  }

  async update(id: string, dto: UpdateBilletingQuarterDto) {
    const updated = await this.billetingQuarterModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException('Billeting quarter not found')
    }

    return {
      success: true,
      message: 'Billeting quarter updated successfully',
      data: updated,
    }
  }

  async remove(id: string) {
    const deleted = await this.billetingQuarterModel.findByIdAndDelete(id)

    if (!deleted) {
      throw new NotFoundException('Billeting quarter not found')
    }

    return {
      success: true,
      message: 'Billeting quarter deleted successfully',
    }
  }

  async setActive(id: string, isActive: boolean) {
    const updated = await this.billetingQuarterModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException('Billeting quarter not found')
    }

    return {
      success: true,
      message: 'Billeting quarter status updated successfully',
      data: updated,
    }
  }

  async updateArrival(id: string, dto: UpdateArrivalDto) {
  const DateTimeEntered = dto.DateTimeEntered ?? new Date()

  const arrivalData = {
    DateTimeEntered,
    athletes: dto.athletes,
    coaches: dto.coaches,
    advance_party: dto.advance_party,
    trainers: dto.trainers,
  }

  const updated = await this.billetingQuarterModel.findByIdAndUpdate(
    id,
    {
      arrived: arrivalData,
    },
    { new: true },
  )

  if (!updated) {
    throw new NotFoundException('Billeting quarter not found')
  }

  await this.delegationArrivalLogModel.create({
    ...arrivalData,
    delegation_id: updated._id,
  })

  return {
    success: true,
    message: 'Delegation arrival updated successfully',
    data: updated,
  }
}
}
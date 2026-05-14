// src/features/current-situation/current-situation.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  CurrentSituation,
  CurrentSituationDocument,
} from './schemas/current-situation.schema'
import {
  Committee,
  CommitteeDocument,
} from './schemas/committee.schema'
import {
  AreaConcern,
  AreaConcernDocument,
} from './schemas/area-concern.schema'
import { CreateCurrentSituationDto } from './dto/create-current-situation.dto'
import { UpdateCurrentSituationDto } from './dto/update-current-situation.dto'
import { FetchCurrentSituationDto } from './dto/fetch-current-situation.dto'

import { CreateCommitteeDto } from './dto/create-committee.dto'
import { UpdateCommitteeDto } from './dto/update-committee.dto'
import { CreateAreaConcernDto } from './dto/create-area-concern.dto'
import { UpdateAreaConcernDto } from './dto/update-area-concern.dto'
import { FetchCommitteeDto } from './dto/fetch-committee.dto'
import { FetchAreaConcernDto } from './dto/fetch-area-concern.dto'

@Injectable()
export class CurrentSituationService {
  constructor(
    @InjectModel(CurrentSituation.name)
    private readonly currentSituationModel: Model<CurrentSituationDocument>,

    @InjectModel(Committee.name)
    private readonly committeeModel: Model<CommitteeDocument>,

    @InjectModel(AreaConcern.name)
    private readonly areaConcernModel: Model<AreaConcernDocument>,
    ) {}

async create(dto: CreateCurrentSituationDto, userId: string) {
  const created = await this.currentSituationModel.create({
    ...dto,
    DateTimeEntered: this.normalizeDateOnly(dto.DateTimeEntered),
    AddedBy: new Types.ObjectId(userId),
  })

  return {
    success: true,
    message: 'Current situation created successfully',
    data: created,
  }
}

  async findAll(query: FetchCurrentSituationDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const search = query.search?.trim()
    const sortBy = query.sortBy ?? 'DateTimeEntered'
    const sortOrder = query.sortOrder ?? 'desc'

    const filter: Record<string, any> = {}

    if (search) {
      filter.$or = [
        { Committee: { $regex: search, $options: 'i' } },
        { area_concern: { $regex: search, $options: 'i' } },
        { cuurent_situation: { $regex: search, $options: 'i' } },
        { issues_concerns: { $regex: search, $options: 'i' } },
        { actions_undertaken: { $regex: search, $options: 'i' } },
        { recommendations: { $regex: search, $options: 'i' } },
      ]
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    }

    const [items, total] = await Promise.all([
      this.currentSituationModel
        .find(filter)
        .populate('AddedBy', 'name username role')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.currentSituationModel.countDocuments(filter),
    ])

    return {
      success: true,
      message: 'Current situations fetched successfully',
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
    const data = await this.currentSituationModel
      .findById(id)
      .populate('AddedBy', 'name username role')
      .lean()

    if (!data) {
      throw new NotFoundException('Current situation not found')
    }

    return {
      success: true,
      message: 'Current situation fetched successfully',
      data,
    }
  }

async update(id: string, dto: UpdateCurrentSituationDto) {
  const updateData = {
    ...dto,
    ...(dto.DateTimeEntered
      ? {
          DateTimeEntered: this.normalizeDateOnly(dto.DateTimeEntered),
        }
      : {}),
  }

  const updated = await this.currentSituationModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true },
  )

  if (!updated) {
    throw new NotFoundException('Current situation not found')
  }

  return {
    success: true,
    message: 'Current situation updated successfully',
    data: updated,
  }
}

  async remove(id: string) {
    const deleted = await this.currentSituationModel.findByIdAndDelete(id)

    if (!deleted) {
      throw new NotFoundException('Current situation not found')
    }

    return {
      success: true,
      message: 'Current situation deleted successfully',
    }
  }

  async createCommittee(dto: CreateCommitteeDto, userId: string) {
  const created = await this.committeeModel.create({
    ...dto,
    AddedBy: new Types.ObjectId(userId),
  })

  return {
    success: true,
    message: 'Committee created successfully',
    data: created,
  }
}

async findCommittees(query: FetchCommitteeDto) {
  const page = query.page ?? 1
  const limit = query.limit ?? 10
  const skip = (page - 1) * limit

  const search = query.search?.trim()
  const sortBy = query.sortBy ?? 'name'
  const sortOrder = query.sortOrder ?? 'asc'

  const filter: Record<string, any> = {}

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
    ]
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  }

  const [items, total] = await Promise.all([
    this.committeeModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('AddedBy', 'name username role')
      .lean(),

    this.committeeModel.countDocuments(filter),
  ])

  return {
    success: true,
    message: 'Committees fetched successfully',
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

async updateCommittee(id: string, dto: UpdateCommitteeDto) {
  const updated = await this.committeeModel.findByIdAndUpdate(id, dto, {
    new: true,
  })

  if (!updated) {
    throw new NotFoundException('Committee not found')
  }

  return {
    success: true,
    message: 'Committee updated successfully',
    data: updated,
  }
}

async removeCommittee(id: string) {
  const areaCount = await this.areaConcernModel.countDocuments({
    committeeId: new Types.ObjectId(id),
  })

  if (areaCount > 0) {
    throw new BadRequestException(
      'Cannot delete committee with existing area concerns',
    )
  }

  const deleted = await this.committeeModel.findByIdAndDelete(id)

  if (!deleted) {
    throw new NotFoundException('Committee not found')
  }

  return {
    success: true,
    message: 'Committee deleted successfully',
  }
}

async createAreaConcern(dto: CreateAreaConcernDto, userId: string) {
  const committee = await this.committeeModel.findById(dto.committeeId)

  if (!committee) {
    throw new NotFoundException('Committee not found')
  }

  const created = await this.areaConcernModel.create({
    name: dto.name,
    committeeId: committee._id,
    committeeName: committee.name,
    isActive: dto.isActive ?? true,
    AddedBy: new Types.ObjectId(userId),
  })

  return {
    success: true,
    message: 'Area concern created successfully',
    data: created,
  }
}

async findAreaConcerns(query: FetchAreaConcernDto) {
  const page = query.page ?? 1
  const limit = query.limit ?? 10
  const skip = (page - 1) * limit

  const search = query.search?.trim()
  const sortBy = query.sortBy ?? 'name'
  const sortOrder = query.sortOrder ?? 'asc'

  const filter: Record<string, any> = {}

  if (query.committeeId) {
    filter.committeeId = new Types.ObjectId(query.committeeId)
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { committeeName: { $regex: search, $options: 'i' } },
    ]
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  }

  const [items, total] = await Promise.all([
    this.areaConcernModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('AddedBy', 'name username role')
      .lean(),

    this.areaConcernModel.countDocuments(filter),
  ])

  return {
    success: true,
    message: 'Area concerns fetched successfully',
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

async updateAreaConcern(id: string, dto: UpdateAreaConcernDto) {
  const updateData: Record<string, any> = {
    ...dto,
  }

  if (dto.committeeId) {
    const committee = await this.committeeModel.findById(dto.committeeId)

    if (!committee) {
      throw new NotFoundException('Committee not found')
    }

    updateData.committeeId = committee._id
    updateData.committeeName = committee.name
  }

  const updated = await this.areaConcernModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true },
  )

  if (!updated) {
    throw new NotFoundException('Area concern not found')
  }

  return {
    success: true,
    message: 'Area concern updated successfully',
    data: updated,
  }
}

async removeAreaConcern(id: string) {
  const deleted = await this.areaConcernModel.findByIdAndDelete(id)

  if (!deleted) {
    throw new NotFoundException('Area concern not found')
  }

  return {
    success: true,
    message: 'Area concern deleted successfully',
  }
}

private normalizeDateOnly(date: Date) {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

}
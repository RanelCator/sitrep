// src/features/reported-incidents/reported-incidents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import {
  ReportedIncident,
  ReportedIncidentDocument,
} from './schemas/reported-incident.schema'
import { CreateReportedIncidentDto } from './dto/create-reported-incident.dto'
import { UpdateReportedIncidentDto } from './dto/update-reported-incident.dto'
import { FetchReportedIncidentsDto } from './dto/fetch-reported-incidents.dto'

@Injectable()
export class ReportedIncidentsService {
  constructor(
    @InjectModel(ReportedIncident.name)
    private readonly reportedIncidentModel: Model<ReportedIncidentDocument>,
  ) {}

async create(dto: CreateReportedIncidentDto, userId: string) {
  const created = await this.reportedIncidentModel.create({
    ...dto,
    AddedBy: new Types.ObjectId(userId),
  })

  return {
    success: true,
    message: 'Reported incident created successfully',
    data: created,
  }
}

  async findAll(query: FetchReportedIncidentsDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const search = query.search?.trim()
    const sortBy = query.sortBy ?? 'Date'
    const sortOrder = query.sortOrder ?? 'desc'

    const filter: Record<string, any> = {}

    if (search) {
      filter.$or = [
        { Time: { $regex: search, $options: 'i' } },
        { venue_location: { $regex: search, $options: 'i' } },
        { Incident: { $regex: search, $options: 'i' } },
        { persons_involved: { $regex: search, $options: 'i' } },
        { initial_action_taken: { $regex: search, $options: 'i' } },
        { current_status: { $regex: search, $options: 'i' } },
        { Remarks: { $regex: search, $options: 'i' } },
      ]
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    }

    const [items, total] = await Promise.all([
      this.reportedIncidentModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.reportedIncidentModel.countDocuments(filter),
    ])

    return {
      success: true,
      message: 'Reported incidents fetched successfully',
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
    const data = await this.reportedIncidentModel.findById(id).lean()

    if (!data) {
      throw new NotFoundException('Reported incident not found')
    }

    return {
      success: true,
      message: 'Reported incident fetched successfully',
      data,
    }
  }

  async update(id: string, dto: UpdateReportedIncidentDto) {
    const updated = await this.reportedIncidentModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException('Reported incident not found')
    }

    return {
      success: true,
      message: 'Reported incident updated successfully',
      data: updated,
    }
  }

  async remove(id: string) {
    const deleted = await this.reportedIncidentModel.findByIdAndDelete(id)

    if (!deleted) {
      throw new NotFoundException('Reported incident not found')
    }

    return {
      success: true,
      message: 'Reported incident deleted successfully',
    }
  }
}
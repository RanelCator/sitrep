import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  DepedIncidentReport,
  DepedIncidentReportDocument,
} from './schema/deped-incident-report.schema'
import { CreateDepedIncidentReportDto } from './dto/create-deped-incident-report.dto'
import { UpdateDepedIncidentReportDto } from './dto/update-deped-incident-report.dto'

@Injectable()
export class DepedIncidentReportService {
  constructor(
    @InjectModel(DepedIncidentReport.name)
    private readonly depedIncidentReportModel: Model<DepedIncidentReportDocument>,
  ) {}

  async create(dto: CreateDepedIncidentReportDto) {
    const report =
      await this.depedIncidentReportModel.create(dto)

    return {
      success: true,
      message: 'DepED incident report created successfully.',
      data: report,
    }
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      this.depedIncidentReportModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.depedIncidentReportModel.countDocuments(),
    ])

    return {
      success: true,
      message: 'DepED incident reports retrieved successfully.',
      data: {
        items,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  }

  async findOne(id: string) {
    const report =
      await this.depedIncidentReportModel
        .findById(id)
        .lean()

    if (!report) {
      throw new NotFoundException(
        'DepED incident report not found.',
      )
    }

    return {
      success: true,
      message: 'DepED incident report retrieved successfully.',
      data: report,
    }
  }

  async update(
    id: string,
    dto: UpdateDepedIncidentReportDto,
  ) {
    const report =
      await this.depedIncidentReportModel.findByIdAndUpdate(
        id,
        dto,
        {
          new: true,
          runValidators: true,
        },
      )

    if (!report) {
      throw new NotFoundException(
        'DepED incident report not found.',
      )
    }

    return {
      success: true,
      message: 'DepED incident report updated successfully.',
      data: report,
    }
  }

  async remove(id: string) {
    const report =
      await this.depedIncidentReportModel.findByIdAndDelete(
        id,
      )

    if (!report) {
      throw new NotFoundException(
        'DepED incident report not found.',
      )
    }

    return {
      success: true,
      message: 'DepED incident report deleted successfully.',
      data: report,
    }
  }
}
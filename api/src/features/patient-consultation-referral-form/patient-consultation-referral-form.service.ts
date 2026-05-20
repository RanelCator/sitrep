// src/features/patient-consultation-referral-form/patient-consultation-referral-form.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  PatientConsultationReferralForm,
  PatientConsultationReferralFormDocument,
} from './schemas/patient-consultation-referral-form.schema'
import { CreatePatientConsultationReferralFormDto } from './dto/create-patient-consultation-referral-form.dto'
import { UpdatePatientConsultationReferralFormDto } from './dto/update-patient-consultation-referral-form.dto'
import { QueryPatientConsultationReferralFormDto } from './dto/query-patient-consultation-referral-form.dto'
import { SqlServerAuthService } from '@/sql-server/sql-server-auth.service'
import { REGIONS } from '@/shared/constants/regions.constant'

@Injectable()
export class PatientConsultationReferralFormService {
  constructor(
    @InjectModel(PatientConsultationReferralForm.name)
    private readonly formModel: Model<PatientConsultationReferralFormDocument>,

    private readonly sqlServerAuthService: SqlServerAuthService,
  ) {}

  async create(dto: CreatePatientConsultationReferralFormDto) {
    const created = await this.formModel.create({
      ...dto,
      formDate: new Date(dto.formDate),
      birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
      incidentDateTime: dto.incidentDateTime
        ? new Date(dto.incidentDateTime)
        : undefined,
    })

    return {
      success: true,
      message: 'Patient consultation/referral form created successfully.',
      data: created,
    }
  }

  async findAll(
    query: QueryPatientConsultationReferralFormDto,
    user?: {
      regionID?: number | null
    },
  ) {
    const page = query.page ?? 1
    const limit = query.pageSize ?? 10
    const skip = (page - 1) * limit

    const search = query.search?.trim()
    const sortBy = query.sortBy ?? 'createdAt'
    const sortOrder = query.sortOrder ?? 'desc'

    const filter: Record<string, any> = {
      isActive: true,
    }

    const regionID = user?.regionID

    if (
      regionID === undefined ||
      regionID === null
    ) {
      filter._id = {
        $exists: false,
      }
    } else if (regionID !== 0) {
      const region = REGIONS.find(
        (item) => item.id === regionID,
      )
      console.log('User region:', region)
      if (!region) {
        filter._id = {
          $exists: false,
        }
      } else {
        filter.region = {
          $regex: `^${region.regionName.trim()}\\s*$`,
          $options: 'i',
        }
      }
    }

    if (search) {
      filter.$or = [
        {
          patientName: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          delegationType: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          region: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          division: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          sportsEvent: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          natureOfIncident: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          impressionDiagnosis: {
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
      this.formModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.formModel.countDocuments(filter),
    ])

    return {
      success: true,
      message: 'Patient consultation/referral forms fetched successfully',
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
    const form = await this.formModel.findById(id).lean()

    if (!form || !form.isActive) {
      throw new NotFoundException(
        'Patient consultation/referral form not found.',
      )
    }

    return {
      success: true,
      message: 'Patient consultation/referral form fetched successfully.',
      data: form,
    }
  }

  async update(
    id: string,
    dto: UpdatePatientConsultationReferralFormDto,
  ) {
    const updatePayload = {
      ...dto,
      ...(dto.formDate && {
        formDate: new Date(dto.formDate),
      }),
      ...(dto.birthdate && {
        birthdate: new Date(dto.birthdate),
      }),
      ...(dto.incidentDateTime && {
        incidentDateTime: new Date(dto.incidentDateTime),
      }),
    }

    const updated = await this.formModel.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true },
    )

    if (!updated) {
      throw new NotFoundException(
        'Patient consultation/referral form not found.',
      )
    }

    return {
      success: true,
      message: 'Patient consultation/referral form updated successfully.',
      data: updated,
    }
  }

  async remove(id: string) {
    const deleted = await this.formModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    )

    if (!deleted) {
      throw new NotFoundException(
        'Patient consultation/referral form not found.',
      )
    }

    return {
      success: true,
      message: 'Patient consultation/referral form deleted successfully.',
      data: deleted,
    }
  }

  async findPlayerById(id: string) {
    const player =
      await this.sqlServerAuthService.findPalaroPlayerById(id)

    if (!player) {
      throw new NotFoundException('Player not found.')
    }

    return {
      success: true,
      message: 'Player fetched successfully.',
      data: player,
    }
  }

  async updateEncodedStatus(
    id: string,
    isEncoded: boolean,
  ) {
    const updated =
      await this.formModel.findByIdAndUpdate(
        id,
        {
          isEncoded,
        },
        {
          new: true,
        },
      )

    if (!updated) {
      throw new NotFoundException(
        'Patient consultation/referral form not found.',
      )
    }

    return {
      success: true,
      message: 'Encoded status updated successfully.',
      data: updated,
    }
  }
}
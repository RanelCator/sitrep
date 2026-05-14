// src/features/misc/misc.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Misc, MiscDocument } from './schemas/misc.schema'
import { UpdateMiscDto } from './dto/update-misc.dto'

@Injectable()
export class MiscService {
  constructor(
    @InjectModel(Misc.name)
    private readonly miscModel: Model<MiscDocument>,
  ) {}

  async findOne() {
    let misc = await this.miscModel.findOne().lean()

    if (!misc) {
      misc = await this.miscModel.create({})
    }

    return {
      success: true,
      message: 'Misc data fetched successfully',
      data: misc,
    }
  }

  async update(dto: UpdateMiscDto, userId?: string) {
    const updated = await this.miscModel.findOneAndUpdate(
      {},
      {
        ...dto,
        updatedBy: userId ? new Types.ObjectId(userId) : undefined,
      },
      {
        new: true,
        upsert: true,
      },
    )

    return {
      success: true,
      message: 'Misc data updated successfully',
      data: updated,
    }
  }
}
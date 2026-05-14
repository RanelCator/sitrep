// src/features/billeting-quarters/dto/update-billeting-quarter.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateBilletingQuarterDto } from './create-billeting-quarter.dto'

export class UpdateBilletingQuarterDto extends PartialType(
  CreateBilletingQuarterDto,
) {}
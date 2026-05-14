// src/features/other-information/dto/update-other-information.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateOtherInformationDto } from './create-other-information.dto'

export class UpdateOtherInformationDto extends PartialType(
  CreateOtherInformationDto,
) {}
// src/features/other-delegation/dto/update-other-delegation.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateOtherDelegationDto } from './create-other-delegation.dto'

export class UpdateOtherDelegationDto extends PartialType(
  CreateOtherDelegationDto,
) {}
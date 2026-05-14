// src/features/current-situation/dto/update-current-situation.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateCurrentSituationDto } from './create-current-situation.dto'

export class UpdateCurrentSituationDto extends PartialType(
  CreateCurrentSituationDto,
) {}
// src/features/current-situation/dto/update-committee.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateCommitteeDto } from './create-committee.dto'

export class UpdateCommitteeDto extends PartialType(CreateCommitteeDto) {}
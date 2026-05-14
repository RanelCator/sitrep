// src/features/current-situation/dto/update-area-concern.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateAreaConcernDto } from './create-area-concern.dto'

export class UpdateAreaConcernDto extends PartialType(CreateAreaConcernDto) {}
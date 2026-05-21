import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type WeatherUpdateDocument = HydratedDocument<WeatherUpdate>

export enum WeatherWarningLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  SEVERE = 'severe',
}

@Schema({ timestamps: true })
export class WeatherUpdate {
  @Prop({ required: true, trim: true })
  place!: string

  @Prop({ required: true })
  date!: Date

  @Prop({ required: true, trim: true })
  temperature!: string

  @Prop({
    required: true,
    enum: WeatherWarningLevel,
    default: WeatherWarningLevel.LOW,
  })
  warningLevel!: WeatherWarningLevel

  @Prop({ trim: true })
  description?: string
}

export const WeatherUpdateSchema =
  SchemaFactory.createForClass(WeatherUpdate)
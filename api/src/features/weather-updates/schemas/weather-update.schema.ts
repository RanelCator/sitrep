import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type WeatherUpdateDocument =
  HydratedDocument<WeatherUpdate>

export const WEATHER_WARNING_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  SEVERE: 'severe',
} as const

export type WeatherWarningLevel =
  (typeof WEATHER_WARNING_LEVELS)[keyof typeof WEATHER_WARNING_LEVELS]

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
    enum: Object.values(WEATHER_WARNING_LEVELS),
    default: WEATHER_WARNING_LEVELS.LOW,
  })
  warningLevel!: WeatherWarningLevel

  @Prop({ trim: true, default: '' })
  description?: string
}

export const WeatherUpdateSchema =
  SchemaFactory.createForClass(WeatherUpdate)
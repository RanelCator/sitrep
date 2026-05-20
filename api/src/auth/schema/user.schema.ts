// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  sqlServerUserId!: string

  @Prop({ required: true })
  username!: string

  @Prop({ required: true })
  name!: string

  @Prop({ default: 'encoder' })
  role!: string

  @Prop({ default: true })
  isActive!: boolean

  @Prop()
  refreshTokenHash?: string

  @Prop()
  refreshTokenId?: string

  @Prop()
  lastLoginAt?: Date

  @Prop()
  regionID?: number
}

export const UserSchema = SchemaFactory.createForClass(User)
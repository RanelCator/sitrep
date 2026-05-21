import { SetMetadata } from '@nestjs/common'

export const REQUIRE_ARS_KEY = 'requireArs'

export const RequireArs = (...arsIds: number[]) =>
  SetMetadata(REQUIRE_ARS_KEY, arsIds)
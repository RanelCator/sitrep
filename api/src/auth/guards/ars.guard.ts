import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { REQUIRE_ARS_KEY } from '../decorators/require-ars.decorator'

@Injectable()
export class ArsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredArs =
      this.reflector.getAllAndOverride<number[]>(
        REQUIRE_ARS_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      )

    if (!requiredArs?.length) {
      return true
    }

    const request =
      context.switchToHttp().getRequest()

    const userArsIds: number[] =
      request.user?.arsIds ?? []

    const hasAccess = requiredArs.some((arsId) =>
      userArsIds.includes(arsId),
    )

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have access to this resource.',
      )
    }

    return true
  }
}
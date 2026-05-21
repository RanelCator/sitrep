import type { AuthUser } from '../types/auth.types'

export function hasArsAccess(
  user: AuthUser | null | undefined,
  arsId: number,
): boolean {
  return user?.arsIds?.includes(arsId) ?? false
}

export function hasAnyArsAccess(
  user: AuthUser | null | undefined,
  arsIds: number[],
): boolean {
  return arsIds.some((arsId) =>
    user?.arsIds?.includes(arsId),
  )
}
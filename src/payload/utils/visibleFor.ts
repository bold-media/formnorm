import { User } from '@payload-types'
import { ClientUser } from 'payload'

export const visibleFor = (
  args: { user: ClientUser },
  allowedRoles: User['roles'] = [],
): boolean => {
  const user = args.user as unknown as User

  if (user?.roles?.includes('admin')) {
    return false
  }

  if (user?.roles?.some((role) => allowedRoles?.includes(role))) {
    return false
  }

  return true
}

export type UserType =
  | 'individual-member'
  | 'group-member'
  | 'committee-member'
  | 'other-member'
  | 'group-delegate'
  | 'tellor-delegate'

export type UserProfile = {
  id: string
  name: string
  type: UserType
}

export type Permission =
  | "ADMINISTRATOR"
  | "ACCOUNTS_READ_ALL"
  | "ACCOUNTS_WRITE_ALL"
  | "DELEGATES_READ_ALL"
  | "DELEGATES_READ_ALL_MEMBERS"
  | "DELEGATES_READ_OWN"
  | "DELEGATES_WRITE_ALL"
  | "DELEGATES_WRITE_ALL_MEMBERS"
  | "DELEGATES_WRITE_OWN"
  | "EVENTS_READ_ALL"
  | "EVENTS_READ_OWN"
  | "EVENTS_READ_UNASSIGNED"
  | "EVENTS_WRITE_ALL";

export type Role =
  | "ADMINISTRATOR"
  | "MEMBER"
  | "GROUP_MEMBER"
  | "INDIVIDUAL_MEMBER"
  | "DELEGATE"
  | "GROUP_DELEGATE"
  | "GROUP_VOTER"
  | "INDIVIDUAL_VOTER"
  | "VOTER"
  | "TELLOR_DELEGATE"
  | "COMMITTEE";

export type UserProfile = {
  id: string;
  name: string;
  roles: Role[];
  permissions: Permission[];
};

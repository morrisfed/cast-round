export type UserType =
  | "individual-member"
  | "group-member"
  | "committee-member"
  | "other-member"
  | "group-delegate"
  | "tellor-delegate";

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

export type UserProfile = {
  id: string;
  name: string;
  type: UserType;
  permissions: Permission[];
};

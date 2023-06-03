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
};

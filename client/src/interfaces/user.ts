import * as t from "io-ts";

export const Role = t.union([
  t.literal("ADMINISTRATOR"),
  t.literal("MEMBER"),
  t.literal("GROUP_MEMBER"),
  t.literal("INDIVIDUAL_MEMBER"),
  t.literal("DELEGATE"),
  t.literal("GROUP_DELEGATE"),
  t.literal("GROUP_VOTER"),
  t.literal("INDIVIDUAL_VOTER"),
  t.literal("VOTER"),
  t.literal("TELLOR"),
  t.literal("COMMITTEE"),
]);

export type Role = t.TypeOf<typeof Role>;

export type UserProfile = {
  id: string;
  name: string;
  roles: Role[];
};

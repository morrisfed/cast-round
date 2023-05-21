import { Permission, UserProfile } from "interfaces/user";

const hasPermission = (profile: UserProfile, permission: Permission) => {
  return profile.permissions.includes(permission);
};

export const showAccounts = (profile: UserProfile) =>
  hasPermission(profile, "ACCOUNTS_READ_ALL") ||
  hasPermission(profile, "ACCOUNTS_WRITE_ALL");

export const showDelegates = (profile: UserProfile) =>
  hasPermission(profile, "DELEGATES_READ_ALL") ||
  hasPermission(profile, "DELEGATES_WRITE_ALL");

export const showEvents = (profile: UserProfile) =>
  hasPermission(profile, "EVENTS_READ_ALL") ||
  hasPermission(profile, "EVENTS_WRITE_ALL");

export const showAdmin = (profile: UserProfile) =>
  hasPermission(profile, "ADMINISTRATOR");

export const showAdminUploadUsers = (profile: UserProfile) =>
  showAdmin(profile) && hasPermission(profile, "ACCOUNTS_WRITE_ALL");

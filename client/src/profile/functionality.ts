import { Role, UserProfile } from "interfaces/user";

const hasRole = (profile: UserProfile, role: Role) =>
  profile.roles.includes(role);

export const showAccounts = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE") ||
  hasRole(profile, "ADMINISTRATOR") ||
  hasRole(profile, "TELLOR_DELEGATE");

export const showEvents = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE") || hasRole(profile, "MEMBER");

export const showAdmin = (profile: UserProfile) =>
  hasRole(profile, "ADMINISTRATOR");

export const showAdminUploadUsers = (profile: UserProfile) =>
  showAdmin(profile);

export const isAddEventEnabled = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

export const showNewEventButton = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

export const showNewVoteButton = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

export const showVoteActionButtons = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

export const showEventGroupDelegate = (profile: UserProfile) =>
  hasRole(profile, "GROUP_MEMBER");

import { Role, UserProfile } from "interfaces/user";

const hasRole = (profile: UserProfile, role: Role) =>
  profile.roles.includes(role);

export const showAccounts = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE") ||
  hasRole(profile, "ADMINISTRATOR") ||
  hasRole(profile, "TELLOR");

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

export const showEditEventButton = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

export const showNewMotionButton = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

export const showMotionActionButtons = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

export const showMotionTotals = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE") || hasRole(profile, "TELLOR");

export const showMotionVoting = (profile: UserProfile) =>
  hasRole(profile, "VOTER");

export const showTellorActions = (profile: UserProfile) =>
  hasRole(profile, "TELLOR");

export const showEventGroupDelegate = (profile: UserProfile) =>
  hasRole(profile, "GROUP_MEMBER");

export const showEventTellors = (profile: UserProfile) =>
  hasRole(profile, "COMMITTEE");

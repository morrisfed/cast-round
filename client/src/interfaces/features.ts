export type FrontEndFeatureFlag =
  | "feature.ui.eventgroupdelegates"
  | "feature.ui.eventtellors";

export type FrontEndFeatureFlags = Record<FrontEndFeatureFlag, boolean>;

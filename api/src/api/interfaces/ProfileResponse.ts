import { FrontEndFeatureFlags } from "../../utils/feature-flags";

export default interface ProfileResponse {
  profile: {
    id: string;
    name: string;
    roles: any[];
    groupDelegateInfo?: {
      delegateForGroupId: string;
      delegateForGroupName: string;
      delegateForEventId: number;
      delegateForRoles: any[];
    };
    tellorInfo?: {
      tellorForEventId: number;
    };
    clerkInfo?: {
      clerkForEventId: number;
    };
  };
  frontEndFeatureFlags: FrontEndFeatureFlags;
}

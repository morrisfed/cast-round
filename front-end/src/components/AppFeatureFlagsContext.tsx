import { FC } from "react";

import { FrontEndFeatureFlags, FrontEndFeatureFlag } from "interfaces/features";
import { PropsWithChildren } from "react";
import { FlagsProvider, useFeature, withFeature } from "flagged";

interface IAppFeatureFlagsContextProps {
  frontEndFeatureFlags: FrontEndFeatureFlags;
}

const AppFeatureFlagsProvider: FC<
  PropsWithChildren<IAppFeatureFlagsContextProps>
> = ({ frontEndFeatureFlags, children }) => {
  return (
    <FlagsProvider features={frontEndFeatureFlags}>{children}</FlagsProvider>
  );
};

const useAppFeatureFlag = (flag: FrontEndFeatureFlag) => {
  return useFeature(flag);
};

const withAppFeatureFlag = (flag: FrontEndFeatureFlag) => withFeature(flag);

export { AppFeatureFlagsProvider, useAppFeatureFlag, withAppFeatureFlag };

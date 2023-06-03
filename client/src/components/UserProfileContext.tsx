import React, { FC, useContext } from "react";

import { UserProfile } from "interfaces/user";
import { PropsWithChildren } from "react";

interface IUserProfileContextProps {
  userProfile: UserProfile;
}

export type IUserProfileContext = {
  userProfile: UserProfile;
};

const contextUninitialisedSymbol = Symbol();

const UserProfileContext = React.createContext<
  IUserProfileContext | typeof contextUninitialisedSymbol
>(contextUninitialisedSymbol);

const UserProfileContextProvider: FC<
  PropsWithChildren<IUserProfileContextProps>
> = ({ userProfile, children }) => {
  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

const useUserProfile = () => {
  const currentContextValue = useContext(UserProfileContext);
  if (currentContextValue === contextUninitialisedSymbol) {
    throw new Error(
      "useUserProfile must be used within a UserProfileContextProvider"
    );
  }
  return currentContextValue.userProfile;
};

export { UserProfileContextProvider, useUserProfile };

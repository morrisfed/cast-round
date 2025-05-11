import express from "express";
import nocache from "nocache";

import ProfileResponse from "./interfaces/ProfileResponse";
import { getFrontEndFeatureFlags } from "../utils/feature-flags";

export const profileRouter = express.Router();

profileRouter.get<{}, ProfileResponse>("/", nocache(), (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      profile: {
        id: req.user.loggedInUser.userId,
        name: req.user.loggedInUser.displayName,
        roles: []
      },
      frontEndFeatureFlags: getFrontEndFeatureFlags(),
    });
  } else {
    throw new Error();
  }
});

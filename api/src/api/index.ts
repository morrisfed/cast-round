import express from "express";

import { profileRouter } from "./profile";

const apiRouter = express.Router();

// All API paths must be authenticated.
// Paths related to the authentication process are handled through a different router provided
// by src/authentication/appAuthentication.ts.
apiRouter.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
});

apiRouter.use("/profile", profileRouter);

export default apiRouter;

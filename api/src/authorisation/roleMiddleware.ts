
// export const adminOnly: RequestHandler = (req, res, next) => {
//   if (!!req.user && isAdministratorRole(req.user.loggedInUser)) {
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// };

// export const memberOnly: RequestHandler = (req, res, next) => {
//   if (isMemberRole(req.user)) {
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// };

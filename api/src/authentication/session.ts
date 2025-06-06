import session, { SessionOptions } from "express-session";
import connectSessionSequelize from "connect-session-sequelize";

import env from "../utils/env";
import { sequelize } from "../persistence/db/models";

const SequelizeStore = connectSessionSequelize(session.Store);
const sequelizeStore = new SequelizeStore({
  db: sequelize,
});
sequelizeStore.sync();

const sessionOptions: SessionOptions = {
  name: "castround.sid",
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: env.isProd },
  store: sequelizeStore,
};

export const sessionRequestHandler = session(sessionOptions);

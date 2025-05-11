import { Sequelize } from "sequelize";
import { initRegisteredRole } from "./RegisteredRole";
import { initPublishedDomainEvent } from "./DomainEvent";
import { initMwAccount } from "./MwAccount";
import { initUser } from "./User";
import env from "../../../utils/env";

export const sequelize = new Sequelize(
  env.MYSQL_DATABASE,
  env.MYSQL_USER,
  env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    logging: false,
  }
);

export const initDbPersistenceModel = async () => {
  initRegisteredRole(sequelize);
  initPublishedDomainEvent(sequelize);
  initMwAccount(sequelize);
  initUser(sequelize);
};

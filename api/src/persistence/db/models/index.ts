import { Sequelize } from "sequelize";
import { initRegisteredRole } from "./RegisteredRole";
import { initPublishedDomainEvent } from "./DomainEvent";
import { initMwAccount } from "./MwAccount";
import { initUser } from "./User";

export const initDbPersistenceModel = async (sequelize: Sequelize) => {
  initRegisteredRole(sequelize);
  initPublishedDomainEvent(sequelize);
  initMwAccount(sequelize);
  initUser(sequelize);
};

import { Sequelize } from "sequelize";
import { initRegisteredRole } from "./RegisteredRole";
import { initPublishedDomainEvent } from "./DomainEvent";

export const initDbPersistenceModel = async (sequelize: Sequelize) => {
  initRegisteredRole(sequelize);
  initPublishedDomainEvent(sequelize);
};

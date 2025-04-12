import { Sequelize } from "sequelize";
import { initRegisteredRole } from "./RegisteredRole";

export const initDbPersistenceModel = async (sequelize: Sequelize) => {
  initRegisteredRole(sequelize);
};

import { DataTypes, QueryInterface } from "sequelize";
import { RunnableMigration } from "umzug";

export default {
  name: "20250510160100-create-mw-accounts",
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("mwMwAccounts", {
      accountId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      accountName: {
        type: DataTypes.STRING,
      },
      contactName: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
      },
      membershipAndLabels: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("mwMwAccounts");
  },
} as RunnableMigration<QueryInterface>;

import { DataTypes, QueryInterface } from "sequelize";
import { RunnableMigration } from "umzug";

export default {
  name: "20250427163900-create-svc-domain-events",
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("svcPublishedDomainEvents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      _tag: {
        type: DataTypes.STRING,
      },
      subscriberId: {
        type: DataTypes.STRING,
      },
      eventJson: {
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
    await queryInterface.dropTable("svcPublishedDomainEvents");
  },
} as RunnableMigration<QueryInterface>;

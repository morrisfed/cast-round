import { DataTypes, QueryInterface } from "sequelize";
import { RunnableMigration } from "umzug";

export default {
  name: "20250420143000-create-registered-role",
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("urRegisteredRoles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
      appId: {
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
    await queryInterface.dropTable("urRegisteredRoles");
  },
} as RunnableMigration<QueryInterface>;

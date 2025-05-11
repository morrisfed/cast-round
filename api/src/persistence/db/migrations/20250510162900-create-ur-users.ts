import { DataTypes, QueryInterface } from "sequelize";
import { RunnableMigration } from "umzug";

export default {
  name: "20250510162900-create-ur-users",
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("urUsers", {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      userType: {
        type: DataTypes.STRING,
      },
      displayName: {
        type: DataTypes.STRING,
      },
      roles: {
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
    await queryInterface.dropTable("urUsers");
  },
} as RunnableMigration<QueryInterface>;

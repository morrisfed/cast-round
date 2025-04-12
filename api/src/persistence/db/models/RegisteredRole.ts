import { CreationOptional, DataTypes, Model, Sequelize } from "sequelize";

export class RegisteredRole extends Model {
  declare name: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

export const initRegisteredRole = (sequelize: Sequelize) =>
  RegisteredRole.init(
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "RegisteredRole",
      tableName: "idrRegisteredRoles",
    }
  );

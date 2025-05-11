import { CreationOptional, DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {
  declare userId: string;

  declare userType: "mwAccount" | "link";

  declare displayName: string;

  declare roles: { name: string; appId: string }[];

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

export const initUser = (sequelize: Sequelize) =>
  User.init(
    {
      userId: { type: DataTypes.STRING, primaryKey: true },
      userType: DataTypes.STRING,
      displayName: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

      roles: {
        type: DataTypes.STRING,
        get() {
          const value = this.getDataValue("roles");
          return value ? JSON.parse(value) : [];
        },
        set(value: { name: string; appId: string }[]) {
          this.setDataValue("roles", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "urUsers",
    }
  );

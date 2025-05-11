import { CreationOptional, DataTypes, Model, Sequelize } from "sequelize";

export class MwAccount extends Model {
  declare accountId: string;

  declare accountName: string;

  declare contactName: string;

  declare membershipAndLabels: string[];

  declare userId: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

export const initMwAccount = (sequelize: Sequelize) =>
  MwAccount.init(
    {
      accountId: { type: DataTypes.STRING, primaryKey: true },
      accountName: DataTypes.STRING,
      contactName: DataTypes.STRING,
      userId: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

      membershipAndLabels: {
        type: DataTypes.STRING,
        get() {
          const value = this.getDataValue("membershipAndLabels");
          return value ? JSON.parse(value) : [];
        },
        set(value: string[]) {
          this.setDataValue("membershipAndLabels", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: "MwAccount",
      tableName: "mwMwAccounts",
    }
  );

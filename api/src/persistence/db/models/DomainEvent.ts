import { CreationOptional, DataTypes, Model, Sequelize } from "sequelize";

export class PublishedDomainEvent extends Model {
  declare _tag: string;

  declare subscriberId: string;
  
  declare eventJson: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

export const initPublishedDomainEvent = (sequelize: Sequelize) =>
  PublishedDomainEvent.init(
    {
      _tag: DataTypes.STRING,
      subscriberId: DataTypes.STRING,
      eventJson: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PublishedDomainEvent",
      tableName: "svcPublishedDomainEvents",
    }
  );

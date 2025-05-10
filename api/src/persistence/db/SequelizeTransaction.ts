import { Context } from "effect";
import { Transaction } from "sequelize";

export class SequelizeTransaction extends Context.Tag("SequelizeTransaction")<
  SequelizeTransaction,
  Transaction
>() {}

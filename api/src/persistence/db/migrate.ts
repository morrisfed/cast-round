import * as path from "path";
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import env from "../../utils/env";
import logger from "../../utils/logging";

const sequelize = new Sequelize(
  env.MYSQL_DATABASE,
  env.MYSQL_USER,
  env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    logging: false,
  }
);

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, "/migrations/*.js"),
    resolve: ({ name, path: migrationJsFilePath, context }) => ({
        name,
        up: async () => {
          const migration = await import(migrationJsFilePath!);
          return migration.up(context, Sequelize);
        } ,
        down: async () => {
          const migration = await import(migrationJsFilePath!);
          return migration.down(context, Sequelize)
        },
      }),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

logger.info("Running migrations...");
umzug.up();
logger.info("Migrations done");

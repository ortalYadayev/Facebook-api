import {createConnection, getConnection} from "typeorm";
import ormconfig from "../../ormconfig";

const createInMemoryDatabaseConnection = () => {
  return createConnection();
};

const closeInMemoryDatabaseConnection = () => {
  return getConnection().close();
};

export {
  createInMemoryDatabaseConnection,
  closeInMemoryDatabaseConnection,
};

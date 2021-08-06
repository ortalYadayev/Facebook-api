import {createConnection, getConnection} from "typeorm";
import ormconfig from "../../ormconfig";

export const connection = {
  create: () => {
    return createConnection({
      ...ormconfig,
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
    });
  },
  close: () => {
    return getConnection().close();
  },
};

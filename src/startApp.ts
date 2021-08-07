import {createFastifyInstance} from "./createFastifyInstance";
import {createConnection} from "typeorm";

export const startApp = async () => {
  const app = await createFastifyInstance();

  const connection = await createConnection();

  try {
    await app.listen(3000)
  } catch (error) {
    app.log.error(error);
    process.exit(1)
  }

  return app;
}

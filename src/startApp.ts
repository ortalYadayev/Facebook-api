import {createFastifyInstance} from "./createFastifyInstance";
import {createConnection} from "typeorm";

const PORT = 3000;

export const startApp = async () => {
  const app = await createFastifyInstance();

  const connection = await createConnection();

  try {
    await app.listen(PORT);
  } catch (error) {
    app.log.error(error);
    process.exit(1)
  }

  return app;
}

import 'reflect-metadata';
import {createConnection} from "typeorm";
import fastify from "fastify";
import fastifyCompress from "fastify-compress";
import {register} from "./routes/register";

export const createFastifyInstance = async () => {
  const app = fastify();

  app.register(fastifyCompress);

  app.register(register);

  return app;
}

const startApp = async () => {
  const app = await createFastifyInstance();

  const connection = await createConnection();
  console.log('hi');

  try {
    await app.listen(3000)
  } catch (error) {
    process.exit(1)
  }
}

startApp()

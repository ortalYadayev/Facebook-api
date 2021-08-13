import fastify from "fastify";
import fastifyCompress from "fastify-compress";
import {register} from "./routes/register";
import process from "process";
import * as dotenv from "dotenv";
import path from "path";

export const createFastifyInstance = async () => {
  const app = fastify();

  app.register(fastifyCompress);

  app.register(register);

  if (process.env.NODE_ENV !== 'test') {
    dotenv.config({ path: path.resolve(__dirname, `../.env`)});
  } else {
    dotenv.config({ path: path.resolve(__dirname, `../.env.test`)});
  }

  return app;
}

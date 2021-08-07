import fastify from "fastify";
import fastifyCompress from "fastify-compress";
import {register} from "./routes/register";

export const createFastifyInstance = async () => {
  const app = fastify();

  app.register(fastifyCompress);

  app.register(register);

  return app;
}

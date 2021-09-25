import fastify, { FastifyInstance } from 'fastify';
import fastifyCompress from 'fastify-compress';
import process from 'process';
import * as dotenv from 'dotenv';
import path from 'path';
import register from './routes/register';
import verify from './routes/verify';

const createFastifyInstance = async (): Promise<FastifyInstance> => {
  const app = fastify();

  app.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      reply.status(422).send(error.validation);
    }
  });

  app.register(fastifyCompress);

  register(app);

  verify(app);

  if (process.env.NODE_ENV !== 'test') {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
  } else {
    dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
  }

  return app;
};

export default createFastifyInstance;

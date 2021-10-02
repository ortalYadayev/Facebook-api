import fastify, { FastifyInstance } from 'fastify';
import fastifyCompress from 'fastify-compress';
import fastifyAuth from 'fastify-auth';
import process from 'process';
import * as dotenv from 'dotenv';
import path from 'path';
import fastifyJWT from 'fastify-jwt';
import fastifyCors from 'fastify-cors';
import authMiddleware from './middlewares/auth';
import register from './routes/register';
import verify from './routes/verify';
import login from './routes/login';
import authUser from './routes/authUser';

const createFastifyInstance = async (): Promise<FastifyInstance> => {
  if (process.env.NODE_ENV !== 'test') {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
  } else {
    dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
  }

  const app = fastify();

  app.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      reply.status(422).send(error.validation);
    }
  });

  app.register(fastifyCompress);
  app.register(fastifyAuth);
  app.register(fastifyJWT, {
    secret: process.env.TOKEN_SECRET || '',
  });
  app.register(fastifyCors, {
    origin: process.env.USER_APP_URL,
    methods: '*',
    allowedHeaders: '*',
  });

  authMiddleware(app);

  register(app);
  verify(app);
  login(app);
  authUser(app);

  return app;
};

export default createFastifyInstance;

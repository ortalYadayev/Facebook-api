import {DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions} from "fastify";

export const register = (app: FastifyInstance, options: FastifyPluginOptions, done: DoneFuncWithErrOrRes) => {
  app.post('/register', async (request, reply) => {
    return reply.code(404).send();
  })

  done();
}

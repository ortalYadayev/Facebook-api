import { FastifyInstance } from 'fastify';

const authUser = (app: FastifyInstance): void => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const authMiddleware = app.authApi;

  app.route({
    url: '/auth',
    method: 'POST',
    preValidation: [authMiddleware],
    handler: async (request, reply) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { user } = request;

      return reply.code(200).send({
        user,
      });
    },
  });
};

export default authUser;

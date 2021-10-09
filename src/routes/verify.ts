import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { MoreThan } from 'typeorm';
import moment from 'moment';
import { UrlToken, UrlTokenEnum } from '../entities/url_token.entity';

const PayloadSchema = Type.Object({
  token: Type.String({ minLength: 8, maxLength: 255 }),
});
type PayloadType = Static<typeof PayloadSchema>;

const verify = (app: FastifyInstance): void => {
  app.route<{ Querystring: PayloadType }>({
    url: '/verify',
    method: 'GET',
    schema: { querystring: PayloadSchema },
    handler: async (request, reply) => {
      const payload = request.query;

      const urlToken = await UrlToken.findOne({
        where: {
          token: payload.token,
          type: UrlTokenEnum.EMAIL_VERIFICATION,
          expireAt: MoreThan(moment().toISOString()),
        },
        relations: ['user'],
      });

      if (!urlToken) {
        return reply.code(422).send({
          message: "This token doesn't exist or expired",
        });
      }

      const { user } = urlToken;

      if (user.verifiedAt) {
        return reply.code(422).send({
          message: 'The show is already verified',
        });
      }

      user.verifiedAt = moment().toDate();

      await user.save();

      urlToken.expireAt = null;

      await urlToken.save();

      // @TODO Need to redirect to login

      return reply.code(200).send();
    },
  });
};

export default verify;

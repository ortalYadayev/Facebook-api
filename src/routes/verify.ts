import {DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions} from "fastify";
import {Static, Type} from '@sinclair/typebox'
import {URLToken} from "../entities/url_token.entity";
import {MoreThan, Raw} from "typeorm";
import {User} from "../entities/user.entity";
import moment from "moment";

const PayloadSchema = Type.Object({
  token: Type.String({minLength: 8, maxLength: 255}),
});
type PayloadType = Static<typeof PayloadSchema>;

export const verify = (app: FastifyInstance, options: FastifyPluginOptions, done: DoneFuncWithErrOrRes) => {
  app.get<{ Querystring: PayloadType }>('/verify', {
    schema: {querystring: PayloadSchema},
  }, async (request, reply) => {
    const payload = request.query;

    const urlToken = await URLToken.findOne({
      where: {
        token: payload.token,
        type: URLToken.TYPE_EMAIL_VERIFICATION,
        expireAt: MoreThan(moment().toISOString())
      },
      relations: ["user"]
    });

    if(!urlToken) {
      return reply.code(422).send({
        message: "This token doesn't exist or expired",
      });
    }

    const user = urlToken.user;

    if(user.verifiedAt){
      return reply.code(422).send({
        message: "The user is already verified",
      });
    }

    user.verifiedAt = moment().toDate();

    await user.save();

    urlToken.expireAt = null;

    await urlToken.save();

    return reply.code(200).send();
  })

  done();
}

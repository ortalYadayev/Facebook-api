import {DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions} from "fastify";
import {Static, Type} from '@sinclair/typebox'
import {URLToken} from "../entities/url_token.entity";
import {Raw} from "typeorm";
import {User} from "../entities/user.entity";

const PayloadSchema = Type.Object({
  token: Type.String({minLength: 8, maxLength: 255}),
});
type PayloadType = Static<typeof PayloadSchema>;

export const verify = (app: FastifyInstance, options: FastifyPluginOptions, done: DoneFuncWithErrOrRes) => {
  app.get<{ Body: PayloadType }>('/verify', {
    schema: {body: PayloadSchema},
  }, async (request, reply) => {
    const payload = request.body;

    const userVerification = await URLToken.findOne({
      where: {
        token: payload.token,
        type: URLToken.TYPE_EMAIL_VERIFICATION,
        expiresIn: Raw((expiresIn) => `${expiresIn} > NOW()`),
      },
    });

    if(!userVerification) {
      return reply.code(422).send({
        message: "This token doesn't exist or expired",
      });
    }

    if(userVerification.user.verifiedAt){
      return reply.code(422).send({
        message: "The user is already verified",
      });
    }

    userVerification.expiresIn = null;

    await userVerification.save();

    let user = await User.findOne({
      where: {
        id: userVerification.user,
      },
    });

    user.verifiedAt = new Date();

    await user.save();

    return reply.code(201).send();
  })

  done();
}

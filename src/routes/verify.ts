import {DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions} from "fastify";
import {Static, Type} from '@sinclair/typebox'
import {URLToken} from "../entities/url_token.entity";
import {Raw} from "typeorm";
import {User} from "../entities/user.entity";
import moment from "moment";

const PayloadSchema = Type.Object({
  token: Type.String({minLength: 8, maxLength: 255}),
});
type PayloadType = Static<typeof PayloadSchema>;

export const verify = (app: FastifyInstance, options: FastifyPluginOptions, done: DoneFuncWithErrOrRes) => {
  app.post<{ Body: PayloadType }>('/verify', {
    schema: {body: PayloadSchema},
  }, async (request, reply) => {
    const payload = request.body;

    const urlToken = await URLToken.findOne({
      where: {
        token: payload.token,
        type: URLToken.TYPE_EMAIL_VERIFICATION,
        expiresIn: Raw((expiresIn) => `${expiresIn} > NOW()`),
      },
      relations: ["user"]
    });

    if(!urlToken) {
      return reply.code(422).send({
        message: "This token doesn't exist or expired",
      });
    }

    // let userFromUrlToken: any = await URLToken.findOne({ relations: ["user"] });

    const user = urlToken.user;

    if(user.verifiedAt != null){
      return reply.code(422).send({
        message: "The user is already verified",
      });
    }

    user.verifiedAt = moment().toDate();

    await user.save();
    console.log(user);

    urlToken.expiresIn = null;

    await urlToken.save();

    return reply.code(201).send();
  })

  done();
}

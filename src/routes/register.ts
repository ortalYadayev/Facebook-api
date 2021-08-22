import {DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions} from "fastify";
import {User} from "../entities/user.entity";
import {Static, Type} from '@sinclair/typebox'
import bcrypt from 'bcrypt';
import moment from "moment";
import {URLToken} from "../entities/url_token.entity";
import {sendMail} from "../services/mail.service";
import Bull, {DoneCallback, Job} from "bull";

const PayloadSchema = Type.Object({
  firstName: Type.String({minLength: 2, maxLength: 50}),
  lastName: Type.String({minLength: 2, maxLength: 50}),
  email: Type.String({format: "email", maxLength: 255}),
  password: Type.String({minLength: 8, maxLength: 255}),
});
type PayloadType = Static<typeof PayloadSchema>;

const emailQueue = new Bull('email', { redis: 'redis://127.0.0.1:6379' }
  // , {
  // redis: process.env.REDIS_URL
// }
);

emailQueue.process((job: Job, done: DoneCallback) => {
  setTimeout(() =>{
    console.log("job processed");
    console.log("job ID: ", job.id);
    done();
  },3000);
});

// emailQueue.on('completed', (job: Job, result: any) => {
//   console.log('This message is from register');
//   console.log(job, result);
// });

export const register = (app: FastifyInstance, options: FastifyPluginOptions, done: DoneFuncWithErrOrRes) => {
  app.post<{ Body: PayloadType }>('/register', {
    schema: {body: PayloadSchema},
  }, async (request, reply) => {
    const payload = request.body;

    const emailIsAlreadyExists = await User.count({
      where: {email: payload.email}
    });

    if (emailIsAlreadyExists) {
      return reply.code(422).send({
        message: 'This email is already being used',
      });
    }

    const user = new User;

    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.password = await bcrypt.hash(payload.password, bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS)));
    user.verifiedAt = null;
    user.urlTokens = [];

    await user.save();

    const urlToken = new URLToken();

    urlToken.type = URLToken.TYPE_EMAIL_VERIFICATION;
    urlToken.token = URLToken.generateRandomToken();
    urlToken.expireAt = moment().add(1, 'months').toDate();
    urlToken.user = user;

    await urlToken.save()

    try {
      // adding a job

      await emailQueue.add({email:
          await sendMail({
            to: user.email,
            subject: "verify",
            text: "email verification",
            html: '<p>Click <a href="http://localhost:3000/verify?token=\'+${urlToken.token}+\'" >here</a> to verify your email</p>'
          })
        });
    }
    catch(error) {
      console.log(error);
    }

    return reply.code(201).send();
  })

  done();
}

import { FastifyInstance } from 'fastify';
import { User } from '../entities/user.entity';
import { UrlToken } from '../entities/url_token.entity';
import { Post } from '../entities/post.entity';
import '../FastifyRequest';

const entities = {
  user: {
    model: User,
    field: 'id',
    name: 'user',
  },
  username: {
    model: User,
    field: 'username',
    name: 'user',
  },
  urlToken: {
    model: UrlToken,
    field: 'id',
    name: 'urlToken',
  },
  post: {
    model: Post,
    field: 'id',
    name: 'post',
  },
};

const getDataByParams = (app: FastifyInstance): void => {
  app.decorate('getDataByParams', async (request, reply, done) => {
    const { params } = request;

    const key = Object.keys(params)[0];
    const value = Object.values(params)[0];
    const entity = entities[key];

    if (!entity) {
      reply.code(404).send("Model doesn't exist");
    }

    const { model, field, name } = entity;

    try {
      const where = {};
      where[field] = value;

      request[name] = await model.findOneOrFail({
        where,
      });

      done();
    } catch {
      reply.code(404).send(`${name} not found`);
    }
  });
};

export default getDataByParams;

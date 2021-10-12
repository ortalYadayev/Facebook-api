import { User } from './entities/user.entity';
import { UrlToken } from './entities/url_token.entity';
import { Post } from './entities/post.entity';

declare module 'fastify' {
  interface FastifyRequest {
    authUser: User | undefined;
    user: User | undefined;
    urlToken: UrlToken | undefined;
    post: Post | undefined;
  }
}

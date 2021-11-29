import { FastifyInstance } from 'fastify';
import { Post } from '../../entities/post.entity';

type ParamsType = { userId: number };

const getPosts = (app: FastifyInstance): void => {
  app.route<{ Params: ParamsType }>({
    url: '/posts/:userId',
    method: 'GET',
    preValidation: app.authMiddleware,
    handler: async (request, reply) => {
      const posts = await Post.find({
        where: {
          user: request.params.userId,
        },
        relations: ['user', 'likes', 'likes.user'],
        order: {
          id: 'DESC',
        },
      });

      const newPosts = [];
      posts.forEach((post) => {
        let likeAuth = false;
        post.likes.forEach((like) => {
          if (like.user.id === request.user.id) {
            likeAuth = true;
          }
        });
        // @ts-ignore
        newPosts.push({ ...post, likeAuth, likesCount: post.likes.length });
      });

      reply.code(200).send(newPosts);
    },
  });
};

export default getPosts;

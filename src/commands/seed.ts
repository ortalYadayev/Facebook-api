import { createConnection } from 'typeorm';
import FriendRequestSeeder from '../database/seeders/friendRequest.seeder';
import FriendSeeder from '../database/seeders/friend.seeder';
import PostSeeder from '../database/seeders/post.seeder';
import UserSeeder from '../database/seeders/user.seeder';
import PostCommentSeeder from '../database/seeders/postCommentSeeder';
import PostLikeSeeder from '../database/seeders/post_like.seeder';
import CommentLikeSeeder from '../database/seeders/comment_like.seeder';
import CommentOnCommentSeeder from '../database/seeders/comment_on_comment.seeder';

const seed = async (): Promise<void> => {
  const connection = await createConnection();

  await new UserSeeder().execute();
  await new PostSeeder().execute();
  await new FriendRequestSeeder().execute();
  await new FriendSeeder().execute();
  await new PostCommentSeeder().execute();
  await new PostLikeSeeder().execute();
  await new CommentLikeSeeder().execute();
  await new CommentOnCommentSeeder().execute();

  await connection.close();
};

seed();

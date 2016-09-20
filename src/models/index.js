import { schema as users, User } from './user';
import { schema as posts, Post } from './post';
import { schema as profiles, Profile } from './profile';
import { schema as schema_migrations } from './base/schema_migration';

// Models registry
// Bookshelf.model('User', User);
// Bookshelf.model('Profile', Profile);

// Expose all models
// export { User } from './user';
// export { Profile } from './profile';

export const schema = {
  users: users,
  posts: posts,
  profiles: profiles,
  schema_migrations: schema_migrations
};

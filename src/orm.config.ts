import { DataSource } from 'typeorm';
import { TagEntity } from './tag/tag.entity'; // Adjust the path as needed
import { UserEntity } from './users/user.entity'; // Adjust the path as needed
import { ArticleEntity } from './article/article.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
  entities: [TagEntity, UserEntity, ArticleEntity], // Array of all entities to be used
  synchronize: true, // Set to true for development, should be false in production
  logging: true, // Enable logging for debugging
  schema: 'public', // Specify the default schema
  migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'], // Specify the path to your migrations
  // cli: {
  //   migrationsDir: 'src/migrations', // Directory where the migration files are stored
  // },
});

export default AppDataSource;

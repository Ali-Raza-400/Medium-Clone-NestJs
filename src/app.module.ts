import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { tagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './orm.config';
import { UserModule } from './users/user.module';
import { UserMiddleware } from './middleware/user.middleware';

// import { TagEntity } from './tag/tag.entity';
import { ArticleController } from './article/article.controller';
import { ArticleService } from './article/article.service';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   port: 5432,
    //   host: 'localhost',
    //   username: 'mediumclone',
    //   password: '123',
    //   database: 'mediumclone',
    //   entities: [TagEntity],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot(AppDataSource.options),
    tagModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
// export class AppModule {}

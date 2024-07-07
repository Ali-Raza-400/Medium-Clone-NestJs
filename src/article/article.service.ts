import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  getAllArticles(): any {
    return 'articles from service';
  }

  async findAlls(query, currentUserId): Promise<any> {
    const querybuilder = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.user', 'user');
    querybuilder.orderBy('articles.created_at', 'DESC');
    if (query.author) {
      console.log('query.author', query.author);
      const author = await this.userRepository.findOne({
        where: { id: 3 },
      });
      console.log('author:::', author);
      querybuilder.andWhere('articles.user = :id', { id: author.id });
    }
    const articleCount = await querybuilder.getCount();
    if (query.limit) {
      querybuilder.limit(query.limit);
    }
    if (query.offset) {
      querybuilder.offset(query.offset);
    }

    const articles = await querybuilder.getMany();

    return { articles, articleCount };
  }

  saveArticle(article: any, currentUser: any) {
    console.log('currentUser:::', currentUser);
    const newArticle = this.articleRepository.create({
      ...article,
      slug: this.getSlug(article.title),
      user: currentUser,
    });

    // console.log('newArticle', newArticle);
    return this.articleRepository.save(newArticle);
  }

  async updateArticle(
    slug: any,
    updatedArticle: any,
    currentUser: any,
  ): Promise<any> {
    console.log('slug', slug);
    console.log('updatedArticle', updatedArticle);
    console.log('currentUser������������', currentUser);

    const article = await this.articleRepository.findOne({ where: { slug } });
    console.log('article', article);
    if (!article) {
      return 'no article found';
    } else if (currentUser.id !== article.user.id) {
      // check if current user is author of article
      return 'unauthorized to update this article';
    } else {
      const newArticle = {
        ...article,
        title: this.getSlug(updatedArticle.title),
      };
      const updatedArticl = await this.articleRepository.save(newArticle);
      return updatedArticl;
    }

    return article;
  }

  getSingleArticle(slug: any): any {
    console.log('slug', slug);
    const article = this.articleRepository.findOne({ where: { slug } });
    return article;
  }
  deleteSingleArticle(slug: any, currentUser: any): Promise<string> {
    console.log('currentUser😉😉😉😉😉😉', currentUser);
    // add filter if author of article  can delte article
    return this.articleRepository
      .findOne({ where: { slug } })
      .then(async (article) => {
        if (!article) {
          return 'no article found';
        } else if (currentUser.id !== article.user.id) {
          // check if current user is author of article
          return 'unauthorized to delete this article';
        } else {
          await this.articleRepository.remove(article);
          return 'article deleted successfully';
        }
      });
  }

  // async addFavoriteArticle(articleId: string, userId: number): Promise<any> {
  //   console.log('articleId', articleId);
  //   const article = await this.articleRepository.findOne({
  //     where: { slug: articleId },
  //   });
  //   console.log('article:::::', article);
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['favorites'],
  //   });
  //   // console.log('user::::', user.favorites.includes(articleId));
  //   //add check user cannot like twice same article
  //   console.log(
  //     'user.favorites.includes(article)',
  //     user.favorites.findIndex((article) => article.id === article.id),
  //   );
  //   if (!article || !user) {
  //     return 'article or user not found';
  //   }
  //   if (user.favorites.includes(article)) {
  //     console.log('user already favorited this article');
  //     return 'user already favorited this article';
  //   }
  //   if (user.favorites.includes(article)) {
  //     user.favorites = user.favorites.filter((fav) => fav.id !== article.id);
  //   } else {
  //     user.favorites.push(article);
  //   }
  //   // await this.userRepository.save(user);
  //   return user;
  // }
  async addFavoriteArticle(articleId: string, userId: number): Promise<any> {
    console.log('articleId', articleId);

    // Find the article by slug
    const article = await this.articleRepository.findOne({
      where: { slug: articleId },
    });
    console.log('article:::::', article);

    // Find the user by ID and include favorites relation
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    if (!article || !user) {
      return 'article or user not found';
    }

    // Check if the article is already in the user's favorites
    const articleIndex = user.favorites.findIndex(
      (fav) => fav.id === article.id,
    );

    if (articleIndex !== -1) {
      // If the article is already in favorites, remove it
      user.favorites = user.favorites.filter((fav) => fav.id !== article.id);
    } else {
      // If the article is not in favorites, add it
      user.favorites.push(article);
    }

    // Save the updated user
    await this.userRepository.save(user);

    return user;
  }

  private getSlug(tile: string): string {
    return (
      slugify(tile, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString()
    );
  }
}

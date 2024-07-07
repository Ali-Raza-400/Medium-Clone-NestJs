import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from 'src/dto/article.dto'; // Adjust the path as needed
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorators';
import { UserEntity } from 'src/users/user.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @Get()
  // async getAllArticles() {
  //   const articles = await this.articleService.getAllArticles();
  //   return articles;
  // }
  @Get('getArticles')
  findAlls(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<any> {
    return this.articleService.findAlls(query, currentUserId);
  }

  @Post('/save')
  @UseGuards(AuthGuard)
  async saveArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<any> {
    const savedArticle = await this.articleService.saveArticle(
      createArticleDto,
      currentUser,
    );
    return { article: { savedArticle } };
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @Body('article') updatedArticle: CreateArticleDto,
    @User() currentUser: UserEntity,
  ): Promise<any> {
    const updatedArticles = await this.articleService.updateArticle(
      slug,
      updatedArticle,
      currentUser,
    );
    return updatedArticles;
  }

  @Get(':slug')
  async getSingleArticle(@Param('slug') slug: string): Promise<any> {
    const article = await this.articleService.getSingleArticle(slug);

    return { article };
  }
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteSingleArticle(
    @Param('slug') slug: string,
    @User() currentUser: UserEntity,
  ): Promise<string> {
    const deletedArticle = await this.articleService.deleteSingleArticle(
      slug,
      currentUser,
    );
    return `Deleted article: ${deletedArticle}`;
  }

  @Post(':slug/favorites')
  @UseGuards(AuthGuard)
  async addFavoriteArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ): Promise<any> {
    const favoriteArticle = await this.articleService.addFavoriteArticle(
      slug,
      currentUserId,
    );
    return favoriteArticle;
  }

  //routes for filtering and sorting and get counts
}

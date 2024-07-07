import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  readonly user: {
    readonly title: string;
    readonly description: string;
    readonly body: string;
    readonly tagList: string[];
  };
}

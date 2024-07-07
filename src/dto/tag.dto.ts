import { IsNotEmpty } from 'class-validator';

export class CreateTagsDto {
  @IsNotEmpty()
  readonly name: string;
}

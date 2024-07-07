import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagsDto } from 'src/dto/tag.dto';
// import { AppService } from './app.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const response = await this.tagService.findAll();
    return { tags: response.map((tags) => tags.name) };
  }
  @Post()
  async saveTags(@Body() createTagsDto: CreateTagsDto): Promise<any> {
    const response = await this.tagService.addTag(createTagsDto);
    return response;
  }
}

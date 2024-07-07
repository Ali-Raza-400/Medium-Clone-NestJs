import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
// import { CreateTagsDto } from 'src/dto/tag.dto';

// ...

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

  //add a tag to the repository
  async addTag(createTagDto: DeepPartial<TagEntity>): Promise<TagEntity> {
    const newTag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag);
  }
}

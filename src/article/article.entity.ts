import { UserEntity } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity({ name: 'article' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column({ default: '' })
  slug: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column('simple-array')
  tagList: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeUpdate()
  updateTimestamps() {
    this.updated_at = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  user: UserEntity;


}

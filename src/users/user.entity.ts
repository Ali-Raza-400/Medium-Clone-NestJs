import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from 'src/article/article.entity';
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }
  @ManyToMany(() => ArticleEntity, () => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.user)
  articles: ArticleEntity[];
}

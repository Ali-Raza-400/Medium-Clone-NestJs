import { UserEntity } from 'src/users/user.entity';
export type userType = Omit<UserEntity, 'hashPassword'>;

export interface userInterface {
  user: userType & { jwt: string };
}

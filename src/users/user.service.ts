import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as jwt from 'jsonwebtoken'; // Correct import for jsonwebtoken
import { JWT_SECRET_KEY } from 'src/config';
import { userInterface } from 'src/types/user.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByUserName = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    const userByUserEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByUserName || userByUserEmail) {
      throw new HttpException('Email or username are taken', 400);
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    console.log('createUserDto', createUserDto);
    console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  //login user

  async login(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new HttpException('Invalid password', 401);
    }
    return this.buildResponse(user);
  }
  // async findById: (id:any) => {
  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //   });
  //   if (!user) {
  //     throw new HttpException('User not found', 404);
  //   }
  //   return this.buildResponse(user);
  // };
  async findById(id: any): Promise<userInterface> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return this.buildResponse(user);
  }
  //update user
  async updateUser(id: any, createUserDto: CreateUserDto): Promise<any> {
    console.log('id:::', id);
    console.log('createUserDto:::', createUserDto);
    const user = await this.userRepository.findOne({
      where: { id },
    });
    console.log('user====>', user);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const newUser = { ...user, ...createUserDto };
    console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  generateToken(user: UserEntity): string {
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET_KEY, // Use a secret key
      { algorithm: 'HS256' }, // Using HMAC with SHA-256
    );
    return token;
  }

  buildResponse(user: any): userInterface {
    return {
      user: {
        ...user,
        jwt: this.generateToken(user),
      },
    };
  }
}

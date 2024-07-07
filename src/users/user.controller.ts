import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserEntity } from './user.entity';
import { User } from 'src/decorators/user.decorators';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @UsePipes(new ValidationPipe())
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async getUser(@Req() request: any, @User() user: any): Promise<any> {
    console.log('user from decorator::::', user);
    return this.userService.buildResponse(user);
  }

  @Post('user/update/:id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Body() createUserDto: CreateUserDto,
    @Req() request: any,
    @Param('id') id: string,
  ): Promise<any> {
    return this.userService.updateUser(id, createUserDto);
  }
}

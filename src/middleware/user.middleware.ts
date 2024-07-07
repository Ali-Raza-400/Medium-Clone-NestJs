import { Injectable } from '@nestjs/common';
import { JWT_SECRET_KEY } from 'src/config';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/users/user.service';
@Injectable()
export class UserMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req, res, next) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, JWT_SECRET_KEY);
    const response = await this.userService.findById(user.id);
    req.user = response.user;

    next();
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@/modules/auth/auth.service';
import { LoginBodyDto } from '@/modules/auth/dto/auth.dto';
import { User } from '@/modules/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({
      username,
      password,
    } as LoginBodyDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

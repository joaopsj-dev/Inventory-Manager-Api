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
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({
      password,
      email,
    } as LoginBodyDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

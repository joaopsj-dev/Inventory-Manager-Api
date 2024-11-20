import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';

import { cookieExtractor, DecodedToken } from '@/utils/jwt.util';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-token-jwt',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: 'MY_REFRESH_TOKEN_SUPER_SECRET_KEY',
    });
  }

  async validate({ id }: DecodedToken): Promise<User> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid User! User may has been deleted from the system. Please contact customer support.',
      );
    }

    return user;
  }
}

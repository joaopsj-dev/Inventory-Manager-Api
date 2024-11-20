import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';

import { DecodedToken } from '@/utils/jwt.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'access-token-jwt',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MY_SUPER_SECRET_KEY',
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

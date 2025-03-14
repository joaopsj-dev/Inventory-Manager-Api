import { LoginBodyDto, RegisterBodyDto } from '@/modules/auth/dto/auth.dto';
import { User } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async register(registerBodyDto: RegisterBodyDto): Promise<User> {
    return await this.userService.create(registerBodyDto);
  }

  public async validateUser(loginBodyDto: LoginBodyDto): Promise<User> {
    try {
      const user: User = await this.userService.findByEmailOrFail(
        loginBodyDto.email,
      );

      await User.comparePassword(loginBodyDto.password, user);

      return user;
    } catch (error) {
      throw new UnauthorizedException('Incorrect Email or Password');
    }
  }

  public async signJwtAccessToken(user: User): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        {
          id: user.id,
          sub: user.email,
        },
        {
          expiresIn: '7d',
          algorithm: 'HS512',
          issuer: 'Nest Advance JWT Authentication',
          audience: 'Authenicated Users',
        },
      );
    } catch (error) {
      throw new ServiceUnavailableException(error.message);
    }
  }

  public async signJwtRefreshToken(user: User): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        {
          id: user.id,
          sub: user.email,
        },
        {
          secret: 'MY_REFRESH_TOKEN_SUPER_SECRET_KEY',
          expiresIn: '7d',
          algorithm: 'HS512',
          issuer: 'Nest Advance JWT Authentication',
          audience: 'Authenicated Users',
        },
      );
    } catch (error) {
      throw new ServiceUnavailableException(error.message);
    }
  }
}

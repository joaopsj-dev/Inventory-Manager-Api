import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FastifyReply } from 'fastify';

import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/guards/local-auth.guard';
import { RefreshTokenJwtAuthGuard } from '@/guards/refresh-token-jwt.guard';

import { AuthUser } from '@/decorators/auth-user.decorator';

import { AuthService } from '@/modules/auth/auth.service';
import { AuthResponseDto, RegisterBodyDto } from '@/modules/auth/dto/auth.dto';
import { UserResponseDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/user.entity';
import {
  setRefreshTokenToHttpOnlyCookie,
  terminateRefreshTokenHttpOnlyCookie,
} from '@/utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  public async register(
    @Body() registerBodyDto: RegisterBodyDto,
    @Res() response: FastifyReply,
  ) {
    const user = await this.authService.register(registerBodyDto);

    setRefreshTokenToHttpOnlyCookie(
      response,
      await this.authService.signJwtRefreshToken(user),
    );

    return await response.send(
      plainToClass(AuthResponseDto, {
        user: plainToClass(UserResponseDto, user),
        accessToken: await this.authService.signJwtAccessToken(user),
      }),
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(@AuthUser() user: User, @Res() response: FastifyReply) {
    setRefreshTokenToHttpOnlyCookie(
      response,
      await this.authService.signJwtRefreshToken(user),
    );

    return await response.send(
      plainToClass(AuthResponseDto, {
        user: plainToClass(UserResponseDto, user),
        accessToken: await this.authService.signJwtAccessToken(user),
      }),
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  public get(@AuthUser() user: User) {
    return plainToClass(UserResponseDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenJwtAuthGuard)
  @Get('/refresh-token')
  public async refreshToken(
    @AuthUser() user: User,
    @Res() response: FastifyReply,
  ) {
    setRefreshTokenToHttpOnlyCookie(
      response,
      await this.authService.signJwtRefreshToken(user),
    );

    return await response.send(
      plainToClass(AuthResponseDto, {
        user: plainToClass(UserResponseDto, user),
        accessToken: await this.authService.signJwtAccessToken(user),
      }),
    );
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  public logout(@Res() response: FastifyReply) {
    terminateRefreshTokenHttpOnlyCookie(response);

    return response.send();
  }
}

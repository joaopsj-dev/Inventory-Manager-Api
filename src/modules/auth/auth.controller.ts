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

import { User } from '../user/user.entity';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RefreshTokenJwtAuthGuard } from 'src/guards/refresh-token-jwt.guard';

import { AuthUser } from 'src/decorators/auth-user.decorator';

import {
  setRefreshTokenToHttpOnlyCookie,
  terminateRefreshTokenHttpOnlyCookie,
} from 'src/utils/response.util';

import { UserResponseDto } from '../user/dto/user.dto';
import { AuthResponseDto, RegisterBodyDto } from './dto/auth.dto';

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
  @Get('/refresh_token')
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

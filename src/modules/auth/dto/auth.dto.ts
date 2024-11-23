import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UserResponseDto } from '@/modules/user/dto/user.dto';

@Exclude()
export class AuthResponseDto {
  @Expose()
  readonly user: UserResponseDto;

  @Expose()
  readonly accessToken: string;
}

export class RegisterBodyDto {
  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  username: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginBodyDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsNotEmpty()
  // @IsEmail()
  email: string;
}

import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

@Exclude()
export class UserResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly username: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  readonly createdAt: Date;
}

export class UserCreateBodyDto {
  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  username: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserUpdateBodyDto {
  //TODO: não deixar o user mudar o id

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsEmail()
  email!: string;
}

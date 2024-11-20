import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { UserService } from '@/modules/user/user.service';

import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

import {
  UserCreateBodyDto,
  UserResponseDto,
  UserUpdateBodyDto,
} from '@/modules/user/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getUsers() {
    return await this.userService.find();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return plainToClass(
      UserResponseDto,
      await this.userService.findByIdOrFail(id),
    );
  }

  public async createUser(@Body() createBodyDto: UserCreateBodyDto) {
    return plainToClass(
      UserResponseDto,
      await this.userService.create(createBodyDto),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  public async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBodyDto: UserUpdateBodyDto,
  ) {
    return plainToClass(
      UserResponseDto,
      await this.userService.update(id, updateBodyDto),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.delete(id);
  }
}

import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import { AppModule } from './app.module';

class Server {
  static async bootstrap() {
    const nestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

    const configService = await nestFastifyApplication.get(ConfigService);

    nestFastifyApplication.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    );

    nestFastifyApplication.enableCors({
      origin: ['http://localhost:3000'],
      credentials: true,
    });

    nestFastifyApplication.setGlobalPrefix('/api/v1');

    nestFastifyApplication.register(fastifyCookie, {
      secret: 'MY_SUPER_SECRET_COOKIE',
    });

    await nestFastifyApplication.listen(
      configService.get('app').port,
      '0.0.0.0',
    );
  }
}

Server.bootstrap();

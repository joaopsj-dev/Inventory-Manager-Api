import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './services/typeorm-config.service';

import { CustomerModule } from 'src/modules/customer/customer.module';
import appConfig from './configs/app.config';
import databaseConfigProd from './configs/database-prod.config';
import databaseConfig from './configs/database.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfigProd, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './services/typeorm-config.service';

import { ProductModule } from '@/modules/product/product.module';
import { StockMovementModule } from '@/modules/stock-movement/stock-movement.module';
import { CustomerModule } from 'src/modules/customer/customer.module';
import appConfig from './configs/app.config';
import databaseConfigProd from './configs/database-prod.config';
import databaseConfig from './configs/database.config';
import { ServiceModule } from './modules/service/service.module';
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
    ServiceModule,
    ProductModule,
    StockMovementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

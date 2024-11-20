import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import appConfig from '@/configs/app.config';
import databaseConfigProd from '@/configs/database-prod.config';
import databaseConfig from '@/configs/database.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { CustomerModule } from '@/modules/customer/customer.module';
import { ProductModule } from '@/modules/product/product.module';
import { ReportModule } from '@/modules/report/report.module';
import { ServiceModule } from '@/modules/service/service.module';
import { StockMovementModule } from '@/modules/stock-movement/stock-movement.module';
import { UserModule } from '@/modules/user/user.module';
import { TypeOrmConfigService } from '@/services/typeorm-config.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

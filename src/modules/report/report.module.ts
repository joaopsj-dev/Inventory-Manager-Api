import { ReportController } from '@/modules/report/report.controller';
import { ReportRepository } from '@/modules/report/report.repository';
import { ReportService } from '@/modules/report/report.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementRepository } from '../stock-movement/stock-movement.repository';
import { ServiceRepository } from '../service/service.repository';
import { ProductRepository } from '../product/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportRepository,
      StockMovementRepository,
      ServiceRepository,
      ProductRepository,
    ]),
  ],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportService],
})
export class ReportModule {}

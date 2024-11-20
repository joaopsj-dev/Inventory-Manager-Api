import { ReportController } from '@/modules/report/report.controller';
import { ReportRepository } from '@/modules/report/report.repository';
import { ReportService } from '@/modules/report/report.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ReportRepository])],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportService],
})
export class ReportModule {}

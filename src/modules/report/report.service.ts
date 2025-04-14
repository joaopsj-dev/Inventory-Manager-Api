import { Report } from '@/modules/report/report.entity';
import { ReportRepository } from '@/modules/report/report.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateSalesReportDTO, ReportInterface } from './dto/report.dto';
import { StockMovementRepository } from '../stock-movement/stock-movement.repository';
import { ServiceRepository } from '../service/service.repository';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository,

    @InjectRepository(StockMovementRepository)
    private stockMovementRepository: StockMovementRepository,

    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,

    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async findReports(): Promise<Report[]> {
    return await this.reportRepository.findReports();
  }

  async generateSalesReport({
    type,
    firstDate,
    lastDate,
    isServicePaid,
    productsIds,
  }: GenerateSalesReportDTO): Promise<Report> {
    let totalExit = 0;
    let totalEntry = 0;
    console.log(firstDate, lastDate);

    if (type === 'PRODUCT') {
      const stockMovements = await this.stockMovementRepository.findAllStockMovements(
        null,
        null,
        firstDate,
        lastDate,
        productsIds,
      );

      for (const movement of stockMovements) {
        if (movement.movementType === 'EXIT') {
          totalExit += movement.negotiatedValue;

          const product = await this.productRepository.findOne(
            movement.productId,
          );
          const costPerUnit = product.price;
          totalEntry += costPerUnit * movement.quantity;
        }
      }

      return await this.reportRepository.generateSalesReport({
        type,
        firstDate,
        lastDate,
        totalEntry,
        totalExit,
        finalBalance: totalExit - totalEntry,
      });
    }

    const services = await this.serviceRepository.findAllServices(
      null,
      firstDate,
      lastDate,
      isServicePaid,
    );

    services.forEach((service) => {
      totalExit += service.value;
    });

    return await this.reportRepository.generateSalesReport({
      type,
      firstDate,
      lastDate,
      totalEntry: 0,
      totalExit,
      finalBalance: totalExit,
    });
  }

  async getReportById(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne(id);

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async deleteReport(id: string): Promise<void> {
    const report = await this.reportRepository.findOne(id);

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    await this.reportRepository.delete(id);
  }
}

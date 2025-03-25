import { Report } from '@/modules/report/report.entity';
import { ReportRepository } from '@/modules/report/report.repository';
import { ReportType } from '@/types/enums/report-type.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerateSalesReportDTO, ReportInterface } from './dto/report.dto';
import { StockMovementRepository } from '../stock-movement/stock-movement.repository';
import { ServiceRepository } from '../service/service.repository';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportRepository)
    private reportRepository: ReportRepository,

    @InjectRepository(StockMovementRepository)
    private stockMovementRepository: StockMovementRepository,

    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async findReports(
    title?: string,
    type?: ReportType,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Report[]> {
    return await this.reportRepository.findReports(
      title,
      type,
      startDate,
      endDate,
    );
  }

  async generateSalesReport({
    type,
    firstDate,
    lastDate,
    isServicePaid,
    productsIds,
  }: GenerateSalesReportDTO): Promise<Report> {
    let totalExit = 0;
    if (type === 'PRODUCT') {
      const stockMovements = await this.stockMovementRepository.findAllStockMovements(
        null,
        null,
        firstDate,
        lastDate,
        productsIds,
      );

      let totalEntry = 0;
      const productCosts: Record<
        string,
        { totalCost: number; totalQuantity: number }
      > = {};

      stockMovements.forEach((movement) => {
        if (movement.movementType === 'ENTRY') {
          if (!productCosts[movement.productId]) {
            productCosts[movement.productId] = {
              totalCost: 0,
              totalQuantity: 0,
            };
          }
          productCosts[movement.productId].totalCost +=
            movement.negotiatedValue;
          productCosts[movement.productId].totalQuantity += movement.quantity;
        }
      });

      stockMovements.forEach((movement) => {
        if (movement.movementType === 'EXIT') {
          totalExit += movement.negotiatedValue;
          const productCost = productCosts[movement.productId];

          if (productCost && productCost.totalQuantity > 0) {
            const costPerUnit =
              productCost.totalCost / productCost.totalQuantity;
            totalEntry += costPerUnit * movement.quantity;
          }
        }
      });

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

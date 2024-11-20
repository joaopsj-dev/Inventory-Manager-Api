import { ReportType } from 'src/types/enums/report-type.enum';
import { EntityRepository, Repository } from 'typeorm';
import { StockMovement } from '../stock-movement/stock-movement.entity';
import { Report } from './report.entity';

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
  async findReports(
    title?: string,
    type?: ReportType,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Report[]> {
    const query = this.createQueryBuilder('report');

    if (title) {
      query.andWhere('report.title LIKE :title', {
        title: `%${title}%`,
      });
    }

    if (type) {
      query.andWhere('report.type = :type', { type });
    }

    if (startDate) {
      query.andWhere('report.generatedAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('report.generatedAt <= :endDate', { endDate });
    }

    return await query.getMany();
  }

  async generateSalesReport(
    startDate: Date,
    endDate: Date,
    type: ReportType,
  ): Promise<Report> {
    const stockMovements = await this.manager
      .getRepository(StockMovement)
      .createQueryBuilder('stockMovement')
      .leftJoinAndSelect('stockMovement.product', 'product')
      .leftJoinAndSelect('stockMovement.service', 'service')
      .where('stockMovement.date >= :startDate', { startDate })
      .andWhere('stockMovement.date <= :endDate', { endDate })
      .getMany();

    const reportData = stockMovements.map((movement) => ({
      id: movement.id,
      productId: movement.product?.id,
      productName: movement.product?.name,
      serviceId: movement.service?.id,
      serviceName: movement.service?.device,
      quantity: movement.quantity,
      movementType: movement.movementType,
      date: movement.date,
    }));

    const report = this.create({
      type,
      data: reportData,
      generatedAt: new Date(),
    });

    return await this.save(report);
  }
}

import { Report } from '@/modules/report/report.entity';
import { ReportType } from '@/types/enums/report-type.enum';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReporterDTO } from './dto/report.dto';

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

  async generateSalesReport(reportData: CreateReporterDTO): Promise<Report> {
    const report = this.create({
      ...reportData,
      generatedAt: new Date(),
    });

    return await this.save(report);
  }
}

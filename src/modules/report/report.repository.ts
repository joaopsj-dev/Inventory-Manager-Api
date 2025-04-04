import { Report } from '@/modules/report/report.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReporterDTO } from './dto/report.dto';
import { DateUtil } from '@/utils/date.util';

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
  async findReports(): Promise<Report[]> {
    const query = this.createQueryBuilder('report');
    return await query.getMany();
  }

  async generateSalesReport(reportData: CreateReporterDTO): Promise<Report> {
    const report = this.create({
      ...reportData,
      firstDate: DateUtil.adjustTimezone(reportData.firstDate, 3).toISOString(),
      lastDate: DateUtil.adjustTimezone(reportData.lastDate, 3).toISOString(),
      generatedAt: new Date(),
    });

    return await this.save(report);
  }
}

import { Report } from '@/modules/report/report.entity';
import { ReportType } from '@/types/enums/report-type.enum';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReporterDTO } from './dto/report.dto';

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
  async findReports(): Promise<Report[]> {
    const query = this.createQueryBuilder('report');
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

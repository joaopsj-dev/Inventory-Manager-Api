import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportType } from 'src/types/enums/report-type.enum';
import { Report } from './report.entity';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

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

  async generateSalesReport(
    startDate: Date,
    endDate: Date,
    type: ReportType,
  ): Promise<Report> {
    return await this.reportRepository.generateSalesReport(
      startDate,
      endDate,
      type,
    );
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

import { Report } from '@/modules/report/report.entity';
import { ReportService } from '@/modules/report/report.service';
import { ReportType } from '@/types/enums/report-type.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async findReports(
    @Query('title') title?: string,
    @Query('type') type?: ReportType,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<Report[]> {
    return this.reportService.findReports(title, type, startDate, endDate);
  }

  @Post('generate-sales-report')
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateSalesReport(
    @Body('startDate') startDate: Date,
    @Body('endDate') endDate: Date,
    @Body('type') type: ReportType,
  ): Promise<Report> {
    return this.reportService.generateSalesReport(startDate, endDate, type);
  }

  @Get(':id')
  async getReportById(@Param('id') id: string): Promise<Report> {
    return this.reportService.getReportById(id);
  }

  @Delete(':id')
  async deleteReport(@Param('id') id: string): Promise<void> {
    return this.reportService.deleteReport(id);
  }
}

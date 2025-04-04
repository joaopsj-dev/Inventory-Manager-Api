import { Report } from '@/modules/report/report.entity';
import { ReportService } from '@/modules/report/report.service';
import { ReportType } from '@/types/enums/report-type.enum';
import {
  BadRequestException,
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
import { GenerateSalesReportDTO } from './dto/report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async findReports(): Promise<Report[]> {
    return this.reportService.findReports();
  }

  @Post('generate-sales-report')
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateSalesReport(
    @Body() body: GenerateSalesReportDTO,
  ): Promise<Report> {
    if (
      (body.firstDate && !body.lastDate) ||
      (!body.firstDate && body.lastDate)
    ) {
      throw new BadRequestException(
        'Ambos firstDate e lastDate devem ser passados juntos.',
      );
    }
    return this.reportService.generateSalesReport(body);
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

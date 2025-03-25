import { ReportType } from '@/types/enums/report-type.enum';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface ReportInterface {
  date: string;
  type: ReportType;
  totalEntry: number;
  totalExit: number;
  finalBalance: number;
}

export class GenerateSalesReportDTO {
  @IsEnum(ReportType)
  type: ReportType;

  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD.' })
  firstDate: Date;

  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD.' })
  lastDate: Date;

  @IsBoolean()
  @IsOptional()
  isServicePaid: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  productsIds: string[];
}

export class CreateReporterDTO {
  @Expose()
  @IsEnum(ReportType)
  type: ReportType;

  @Expose()
  @IsDate()
  @Type(() => Date)
  firstDate: Date;

  @Expose()
  @IsDate()
  @Type(() => Date)
  lastDate: Date;

  @Expose()
  @IsNumber()
  totalEntry: number;

  @Expose()
  @IsNumber()
  totalExit: number;

  @Expose()
  @IsNumber()
  finalBalance: number;
}

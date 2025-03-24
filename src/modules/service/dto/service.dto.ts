import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
  PaymentStatus,
  ServiceStatus,
} from '@/types/enums/service-status.enum';
import { Optional } from '@nestjs/common';

export class ServiceResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly device: string;

  @Expose()
  readonly status: string;

  @Expose()
  readonly defect: string;

  @Expose()
  readonly customerId: string;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}

export class ServiceCreateDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly customerId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly device: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly defect: string;

  @Expose()
  @IsNumber()
  readonly value: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  readonly advanceValue?: number;

  @Expose()
  @IsEnum(PaymentStatus)
  readonly paymentStatus: PaymentStatus;

  @Expose()
  @IsEnum(ServiceStatus)
  readonly status: ServiceStatus;

  @Expose()
  @IsDate()
  @Type(() => Date)
  readonly receivedAt: Date;

  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly deliveryDate?: Date;
}

export class ServiceUpdateDto {
  @Expose()
  @IsString()
  @IsOptional()
  device?: string;

  @Expose()
  @IsString()
  @IsOptional()
  defect?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  value?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  advanceValue?: number;

  @Expose()
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @Expose()
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;

  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  receivedAt?: Date;

  @Expose()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deliveryDate?: Date;
}

export class ServiceFindAllDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly clientName: string;

  @Expose()
  readonly customerId: string;

  @Expose()
  readonly userId: string;

  @Expose()
  readonly device: string;

  @Expose()
  readonly defect: string;

  @Expose()
  readonly value: number;

  @Expose()
  readonly isPaid: boolean;

  @Expose()
  @Optional()
  readonly advanceValue: number;

  @Expose()
  readonly paymentStatus: PaymentStatus;

  @Expose()
  readonly status: ServiceStatus;

  @Expose()
  readonly receivedAt: Date;

  @Expose()
  readonly deliveryDate: Date;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  readonly customer: any;

  @Expose()
  readonly user: any;
}

export class ServiceQueryDto {
  @IsOptional()
  @IsString()
  clientName?: string;

  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD.' })
  @IsOptional()
  firstDate?: string;

  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD.' })
  @IsOptional()
  lastDate?: string;
}

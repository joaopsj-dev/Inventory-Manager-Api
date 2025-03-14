import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsDateString,
  isUUID,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ServiceStatus } from '@/types/enums/service-status.enum';
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
  @IsNumber()
  @IsOptional()
  readonly remainingValue?: number;

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
  @IsNumber()
  @IsOptional()
  remainingValue?: number;

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
  readonly remainingValue: number;

  @Expose()
  readonly isPaid: boolean;

  @Expose()
  @Optional()
  readonly advanceValue: number;

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

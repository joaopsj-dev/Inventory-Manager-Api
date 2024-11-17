import { Expose } from 'class-transformer';
import { ServiceStatus } from '@/types/enums/service-status.enum';

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
  readonly advanceValue: number;

  @Expose()
  readonly status: ServiceStatus;

  @Expose()
  readonly receivedAt: Date;

  @Expose()
  readonly deliveryDate: Date;
}

export class ServiceUpdateDto {
  @Expose()
  readonly device?: string;

  @Expose()
  readonly defect?: string;

  @Expose()
  readonly value?: number;

  @Expose()
  readonly advanceValue?: number;

  @Expose()
  readonly status?: ServiceStatus;

  @Expose()
  readonly receivedAt?: Date;

  @Expose()
  readonly deliveryDate?: Date;
}

export class ServiceFindAllDto {
  @Expose()
  readonly id: string;

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

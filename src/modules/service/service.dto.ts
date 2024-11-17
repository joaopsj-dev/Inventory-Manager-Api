import { Expose } from 'class-transformer';

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

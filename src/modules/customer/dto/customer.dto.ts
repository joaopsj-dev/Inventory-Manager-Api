import { Exclude, Expose, Type } from 'class-transformer';

import { ServiceResponseDto } from '@/modules/service/dto/service.dto';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@Exclude()
export class CustomerBaseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly contact: string;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  readonly createdAt: Date;
}

export class CustomerCreateDto {
  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  name: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  contact: string;
}

export class CustomerUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  contact!: string;
}

export class CustomerFindAllDto extends CustomerBaseDto {
  @Expose()
  @Type(() => ServiceResponseDto)
  readonly services: ServiceResponseDto[];

  @Expose()
  readonly servicesCount: number;
}

export class CustomerFindOneDto extends CustomerBaseDto {
  @Expose()
  @Type(() => ServiceResponseDto)
  readonly services: ServiceResponseDto[];

  @Expose()
  readonly completedCount: number;

  @Expose()
  readonly pendingCount: number;
}

export class CustomerQueryDto {
  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  defect?: string;
}

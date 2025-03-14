import { Exclude, Expose, Type } from 'class-transformer';

import { ServiceResponseDto } from '@/modules/service/dto/service.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

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

export class GetUserDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contact?: string;
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

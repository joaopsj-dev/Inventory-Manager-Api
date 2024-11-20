import { ProductUnit } from '@/types/enums/product-unit-type.enum';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@Exclude()
export class ProductBaseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly price: number;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly details: string;

  @Expose()
  @IsEnum(ProductUnit)
  readonly unit: ProductUnit;

  @Expose()
  readonly purchaseDate: Date;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}

export class ProductCreateDto {
  @MinLength(4)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  details?: string;

  @IsNotEmpty()
  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @IsNotEmpty()
  purchaseDate: Date;
}

export class ProductUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ProductUnit)
  unit?: ProductUnit;

  @IsOptional()
  purchaseDate?: Date;
}

export class ProductFindAllDto extends ProductBaseDto {
  @Expose()
  readonly stockMovements: any[];
}

export class ProductFindOneDto extends ProductBaseDto {
  @Expose()
  readonly stockMovements: any[];
}

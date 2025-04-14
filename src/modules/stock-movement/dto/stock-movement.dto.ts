import { StockMovementType } from '@/types/enums/stock-movement-type.enum';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@Exclude()
export class StockMovementBaseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly productId: string;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly movementType: StockMovementType;

  @Expose()
  readonly negotiatedValue: number;

  @Expose()
  readonly date: Date;

  @Expose()
  readonly isFirstMovement: boolean;
}

export class StockMovementCreateDto {
  @Expose()
  @IsString()
  productId: string;

  @Expose()
  @IsNumber()
  quantity: number;

  @Expose()
  @IsNumber()
  negotiatedValue: number;

  @Expose()
  @IsEnum(StockMovementType)
  movementType: StockMovementType;

  @Expose()
  @IsDate()
  @Type(() => Date)
  date: Date;
}

export class StockMovementUpdateDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  negotiatedValue?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}

export class StockMovementFindAllDto extends StockMovementBaseDto {
  @Expose()
  readonly productName: string;
}

export class StockMovementFindOneDto extends StockMovementBaseDto {
  @Expose()
  readonly productName: string;
}

export class StockMovementQueryDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  movementType?: StockMovementType;

  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD.' })
  @IsOptional()
  firstDate?: string;

  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD.' })
  @IsOptional()
  lastDate?: string;
}

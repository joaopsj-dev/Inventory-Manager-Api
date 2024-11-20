import { StockMovementType } from '@/types/enums/stock-movement-type.enum';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
}

export class StockMovementCreateDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  movementType: StockMovementType;
}

export class StockMovementUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  movementType?: StockMovementType;
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
}

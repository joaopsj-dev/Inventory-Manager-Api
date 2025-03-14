import {
  StockMovementCreateDto,
  StockMovementUpdateDto,
} from '@/modules/stock-movement/dto/stock-movement.dto';
import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { StockMovementType } from '@/types/enums/stock-movement-type.enum';
import { DateUtil } from '@/utils/date.util';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(StockMovement)
export class StockMovementRepository extends Repository<StockMovement> {
  async createStockMovement(
    stockMovement: StockMovementCreateDto,
  ): Promise<StockMovement> {
    const newStockMovement = this.create({
      ...stockMovement,
      date: DateUtil.adjustTimezone(stockMovement.date, 3).toISOString(),
      isFirstMovement: false,
    });
    return await this.save(newStockMovement);
  }

  async updateStockMovement(
    id: string,
    { date, ...rest }: StockMovementUpdateDto,
  ): Promise<StockMovement> {
    date = (DateUtil.adjustTimezone(date, 3).toISOString() as unknown) as Date;
    const updateStockMovement = this.create({
      date,
      ...rest,
    });

    await this.save({ ...updateStockMovement, id });
    return await this.findOne(id);
  }

  async findAllStockMovements(
    productName?: string,
    movementType?: StockMovementType,
  ): Promise<StockMovement[]> {
    const query = this.createQueryBuilder('stockMovement').leftJoinAndSelect(
      'stockMovement.product',
      'product',
    );

    if (productName) {
      query.andWhere('product.name LIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    if (movementType) {
      query.andWhere('stockMovement.movementType = :movementType', {
        movementType,
      });
    }

    const stockMovements = await query.getMany();

    return stockMovements.map((stockMovement) => ({
      id: stockMovement.id,
      productId: stockMovement.product.id,
      productName: stockMovement.product.name,
      quantity: stockMovement.quantity,
      movementType: stockMovement.movementType,
      date: stockMovement.date,
      product: stockMovement.product,
      service: stockMovement.service,
      serviceId: stockMovement.serviceId,
      negotiatedValue: stockMovement.negotiatedValue,
      isFirstMovement: stockMovement.isFirstMovement,
    }));
  }

  async deleteStockMovement(id: string): Promise<void> {
    const stockMovement = await this.findOne(id);

    if (!stockMovement) {
      throw new Error('Stock movement not found');
    }

    await this.remove(stockMovement);
  }
}

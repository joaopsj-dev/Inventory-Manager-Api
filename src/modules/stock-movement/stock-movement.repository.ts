import { ProductRepository } from '@/modules/product/product.repository';
import {
  StockMovementCreateDto,
  StockMovementUpdateDto,
} from '@/modules/stock-movement/dto/stock-movement.dto';
import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { StockMovementType } from '@/types/enums/stock-movement-type.enum';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(StockMovement)
export class StockMovementRepository extends Repository<StockMovement> {
  constructor(private productRepository: ProductRepository) {
    super();
  }

  async createStockMovement(
    stockMovement: StockMovementCreateDto,
  ): Promise<StockMovement> {
    const product = await this.productRepository.findOne(
      stockMovement.productId,
    );

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.quantity < stockMovement.quantity) {
      throw new Error('Insufficient stock for the product');
    }

    product.quantity -= stockMovement.quantity;
    await this.productRepository.save(product);

    const newStockMovement = this.create({
      ...stockMovement,
      movementType: StockMovementType.EXIT,
      negotiatedValue: stockMovement.negotiatedValue,
    });

    return await this.save(newStockMovement);
  }

  async updateStockMovement(
    id: string,
    stockMovement: StockMovementUpdateDto,
  ): Promise<StockMovement> {
    const updateStockMovement = this.create({
      ...stockMovement,
      negotiatedValue: stockMovement.negotiatedValue,
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

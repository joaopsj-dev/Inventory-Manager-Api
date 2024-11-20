import { ProductRepository } from '@/modules/product/product.repository';
import {
  StockMovementCreateDto,
  StockMovementFindAllDto,
  StockMovementQueryDto,
  StockMovementUpdateDto,
} from '@/modules/stock-movement/dto/stock-movement.dto';
import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { StockMovementRepository } from '@/modules/stock-movement/stock-movement.repository';
import { StockMovementType } from '@/types/enums/stock-movement-type.enum';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StockMovementService {
  constructor(
    private stockMovementRepository: StockMovementRepository,
    private productRepository: ProductRepository,
  ) {}

  async create(stockMovement: StockMovementCreateDto): Promise<StockMovement> {
    const product = await this.productRepository.findOne(
      stockMovement.productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < stockMovement.quantity) {
      throw new Error('Insufficient stock for the product');
    }

    product.quantity -= stockMovement.quantity;
    await this.productRepository.save(product);

    const newStockMovement = this.stockMovementRepository.create({
      ...stockMovement,
      movementType: StockMovementType.EXIT,
      negotiatedValue: stockMovement.price,
    });

    return await this.stockMovementRepository.save(newStockMovement);
  }

  async findAll(
    query: StockMovementQueryDto,
  ): Promise<StockMovementFindAllDto[]> {
    const { productName, movementType } = query;
    const stockMovements = await this.stockMovementRepository.findAllStockMovements(
      productName,
      movementType,
    );

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
      negotiatedValue: stockMovement.negotiatedValue, // Adicionando a nova propriedade
    }));
  }

  async update(
    id: string,
    stockMovement: StockMovementUpdateDto,
  ): Promise<StockMovement> {
    const existingStockMovement = await this.stockMovementRepository.findOne(
      id,
    );

    if (!existingStockMovement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    return await this.stockMovementRepository.updateStockMovement(
      id,
      stockMovement,
    );
  }

  async delete(id: string): Promise<void> {
    const stockMovement = await this.stockMovementRepository.findOne(id);

    if (!stockMovement) {
      throw new NotFoundException(`Stock movement with ID ${id} not found`);
    }

    await this.stockMovementRepository.deleteStockMovement(id);
  }
}

import {
  StockMovementCreateDto,
  StockMovementFindAllDto,
  StockMovementQueryDto,
  StockMovementUpdateDto,
} from '@/modules/stock-movement/dto/stock-movement.dto';
import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { StockMovementRepository } from '@/modules/stock-movement/stock-movement.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StockMovementService {
  constructor(private stockMovementRepository: StockMovementRepository) {}

  async create(stockMovement: StockMovementCreateDto): Promise<StockMovement> {
    return await this.stockMovementRepository.createStockMovement(
      stockMovement,
    );
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

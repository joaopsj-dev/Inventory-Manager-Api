import { ProductRepository } from '@/modules/product/product.repository';
import {
  StockMovementCreateDto,
  StockMovementFindAllDto,
  StockMovementQueryDto,
  StockMovementUpdateDto,
} from '@/modules/stock-movement/dto/stock-movement.dto';
import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { StockMovementRepository } from '@/modules/stock-movement/stock-movement.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class StockMovementService {
  constructor(
    @InjectRepository(StockMovementRepository)
    private stockMovementRepository: StockMovementRepository,

    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async create(stockMovement: StockMovementCreateDto): Promise<StockMovement> {
    const product = await this.productRepository.findOne(
      stockMovement.productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      stockMovement.movementType === 'EXIT' &&
      product.quantity < stockMovement.quantity
    ) {
      throw new UnprocessableEntityException(
        'Insufficient stock for the product',
      );
    }

    if (stockMovement.movementType === 'ENTRY') {
      product.quantity += stockMovement.quantity;
    } else {
      product.quantity -= stockMovement.quantity;
    }

    await this.productRepository.save(product);
    return this.stockMovementRepository.createStockMovement(stockMovement);
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
      product: {
        id: stockMovement.product.id,
        name: stockMovement.product.name,
      },
      negotiatedValue: stockMovement.negotiatedValue,
      isFirstMovement: stockMovement.isFirstMovement,
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

    if (stockMovement.quantity !== existingStockMovement.quantity) {
      const product = await this.productRepository.findOneProduct(
        stockMovement.productId,
      );

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${stockMovement.productId} not found`,
        );
      }

      let adjustedQuantity: number;

      if (stockMovement.movementType === 'ENTRY') {
        adjustedQuantity =
          product.quantity -
          existingStockMovement.quantity +
          stockMovement.quantity;
      } else {
        adjustedQuantity =
          product.quantity +
          existingStockMovement.quantity -
          stockMovement.quantity;

        if (adjustedQuantity < 0) {
          throw new UnprocessableEntityException(
            'Insufficient stock for the product',
          );
        }
      }

      await this.productRepository.updateProduct(product.id, {
        ...product,
        quantity: adjustedQuantity,
      });
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

    const product = await this.productRepository.findOneProduct(
      stockMovement.productId,
    );
    const adjustedQuantity =
      stockMovement.movementType === 'ENTRY'
        ? product.quantity - stockMovement.quantity
        : product.quantity + stockMovement.quantity;
    await this.productRepository.updateProduct(product.id, {
      ...product,
      quantity: adjustedQuantity,
    });

    await this.stockMovementRepository.deleteStockMovement(id);
  }
}

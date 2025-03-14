import {
  IncrementProductStockDto,
  ProductCreateDto,
  ProductFindAllDto,
  ProductFindOneDto,
  ProductUpdateDto,
} from '@/modules/product/dto/product.dto';
import { Product } from '@/modules/product/product.entity';
import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { StockMovementType } from '@/types/enums/stock-movement-type.enum';
import { DateUtil } from '@/utils/date.util';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findOneProduct(id: string): Promise<ProductFindOneDto | undefined> {
    const product = await this.findOne(id, { relations: ['stockMovements'] });

    if (!product) {
      throw new Error('Product not found');
    }

    const productDto: ProductFindOneDto = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      details: product.details,
      unit: product.unit,
      purchaseDate: product.purchaseDate,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      stockMovements: product.stockMovements,
    };

    return productDto;
  }

  async createProduct({
    purchaseDate,
    ...restProduct
  }: ProductCreateDto): Promise<Product> {
    purchaseDate = (DateUtil.adjustTimezone(
      purchaseDate,
      3,
    ).toISOString() as unknown) as Date;
    const newProduct = this.create({ purchaseDate, ...restProduct });
    const savedProduct = await this.save(newProduct);

    const stockMovement = new StockMovement();
    stockMovement.productId = savedProduct.id;
    stockMovement.quantity = restProduct.quantity;
    stockMovement.negotiatedValue = restProduct.price;
    stockMovement.movementType = StockMovementType.ENTRY;
    stockMovement.date = purchaseDate;
    stockMovement.isFirstMovement = true;

    await this.manager.save(stockMovement);

    return savedProduct;
  }

  async updateProduct(
    id: string,
    { purchaseDate, ...restProduct }: ProductUpdateDto,
  ): Promise<Product> {
    const existingProduct = await this.findOne(id);

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    purchaseDate = (DateUtil.adjustTimezone(
      purchaseDate,
      3,
    ).toISOString() as unknown) as Date;
    const updatedProduct = this.create({ purchaseDate, ...restProduct });
    await this.save({ ...updatedProduct, id });

    if (restProduct.price !== undefined || restProduct.quantity !== undefined) {
      const lastStockMovement = await this.manager.findOne(StockMovement, {
        where: { productId: id },
        order: { date: 'DESC' },
      });

      if (lastStockMovement) {
        if (restProduct.quantity !== undefined) {
          lastStockMovement.quantity = restProduct.quantity;
        }
        lastStockMovement.date = new Date();
        await this.manager.save(lastStockMovement);
      }
    }

    return await this.findOne(id);
  }

  async incrementProductStock(
    incrementProductStockDto: IncrementProductStockDto,
  ): Promise<Product> {
    const { id, quantity, purchaseDate, price } = incrementProductStockDto;
    const product = await this.findOne(id);

    if (!product) {
      throw new Error('Product not found');
    }

    const totalQuantity = product.quantity + quantity;
    const totalPrice = product.price * product.quantity + price * quantity;
    const averagePrice = totalPrice / totalQuantity;

    product.quantity = totalQuantity;
    product.price = averagePrice;
    product.purchaseDate = purchaseDate;
    await this.save(product);

    const stockMovement = new StockMovement();
    stockMovement.productId = product.id;
    stockMovement.quantity = quantity;
    stockMovement.negotiatedValue = price;
    stockMovement.movementType = StockMovementType.ENTRY;
    stockMovement.date = new Date();

    await this.manager.save(stockMovement);

    return product;
  }

  async findAllProducts(name?: string): Promise<ProductFindAllDto[]> {
    const query = this.createQueryBuilder('product');

    if (name) {
      query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    const products = await query.getMany();

    return products.map((product) => {
      const productDto: ProductFindAllDto = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        details: product.details,
        unit: product.unit,
        purchaseDate: product.purchaseDate,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        stockMovements: product.stockMovements,
      };
      return productDto;
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.findOne(id, { relations: ['stockMovements'] });

    if (!product) {
      throw new Error('Product not found');
    }

    await this.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(StockMovement, { productId: id });
      await transactionalEntityManager.remove(product);
    });
  }
}

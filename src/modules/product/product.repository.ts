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
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createProduct(product: ProductCreateDto): Promise<Product> {
    const newProduct = this.create(product);
    const savedProduct = await this.save(newProduct);

    const stockMovement = new StockMovement();
    stockMovement.productId = savedProduct.id;
    stockMovement.quantity = product.quantity;
    stockMovement.negotiatedValue = product.price;
    stockMovement.movementType = StockMovementType.ENTRY;
    stockMovement.date = new Date();

    await this.manager.save(stockMovement);

    return savedProduct;
  }

  async updateProduct(id: string, product: ProductUpdateDto): Promise<Product> {
    const existingProduct = await this.findOne(id);

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updatedProduct = this.create(product);
    await this.save({ ...updatedProduct, id });

    if (product.price !== undefined || product.quantity !== undefined) {
      const lastStockMovement = await this.manager.findOne(StockMovement, {
        where: { productId: id },
        order: { date: 'DESC' },
      });

      if (lastStockMovement) {
        if (product.quantity !== undefined) {
          lastStockMovement.quantity = product.quantity;
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

  async deleteProduct(id: string): Promise<void> {
    const product = await this.findOne(id);

    if (!product) {
      throw new Error('Product not found');
    }

    await this.remove(product);
  }
}

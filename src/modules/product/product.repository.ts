import {
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
    stockMovement.movementType = StockMovementType.ENTRY;
    stockMovement.date = new Date();

    await this.manager.save(stockMovement);

    return savedProduct;
  }

  async updateProduct(id: string, product: ProductUpdateDto): Promise<Product> {
    const updateProduct = this.create(product);
    await this.save({ ...updateProduct, id });
    return await this.findOne(id);
  }

  async findAllProducts(name?: string): Promise<ProductFindAllDto[]> {
    const query = this.createQueryBuilder('product');

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
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

import {
  ProductCreateDto,
  ProductFindAllDto,
  ProductFindOneDto,
  ProductUpdateDto,
} from '@/modules/product/dto/product.dto';
import { Product } from '@/modules/product/product.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  //TODO: ao criar um produto, deve-se criar um registro na tabela stock-movement com a entrada desse peoduto no estoque.
  async createProduct(product: ProductCreateDto): Promise<Product> {
    const newProduct = this.create(product);
    return await this.save(newProduct);
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

import {
  IncrementProductStockDto,
  ProductCreateDto,
  ProductFindAllDto,
  ProductFindOneDto,
  ProductUpdateDto,
} from '@/modules/product/dto/product.dto';
import { Product } from '@/modules/product/product.entity';
import { ProductRepository } from '@/modules/product/product.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async findAll(name?: string): Promise<ProductFindAllDto[]> {
    return this.productRepository.findAllProducts(name);
  }

  async findOne(id: string): Promise<ProductFindOneDto> {
    const product = await this.productRepository.findOneProduct(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(product: ProductCreateDto): Promise<Product> {
    return await this.productRepository.createProduct(product);
  }

  async update(id: string, product: ProductUpdateDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne(id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return await this.productRepository.updateProduct(id, product);
  }

  async incrementStock(
    incrementProductStockDto: IncrementProductStockDto,
  ): Promise<Product> {
    return await this.productRepository.incrementProductStock(
      incrementProductStockDto,
    );
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.deleteProduct(id);
  }
}

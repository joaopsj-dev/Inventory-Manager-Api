import { ProductController } from '@/modules/product/product.controller';
import { ProductRepository } from '@/modules/product/product.repository';
import { ProductService } from '@/modules/product/product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository])],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}

import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import {
  IncrementProductStockDto,
  ProductCreateDto,
  ProductUpdateDto,
} from '@/modules/product/dto/product.dto';
import { ProductService } from '@/modules/product/product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAllProducts(@Query('name') name?: string) {
    return await this.productService.findAll(name);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('/increment-stock')
  public async incrementProductStock(
    @Body() incrementStockDto: IncrementProductStockDto,
  ) {
    return await this.productService.incrementStock(incrementStockDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getProduct(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createProduct(@Body() createBodyDto: ProductCreateDto) {
    return await this.productService.create(createBodyDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  public async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productUpdateBody: ProductUpdateDto,
  ) {
    return await this.productService.update(id, productUpdateBody);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.delete(id);
  }
}

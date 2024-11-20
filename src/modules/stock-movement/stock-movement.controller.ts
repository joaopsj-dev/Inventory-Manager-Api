import {
  StockMovementCreateDto,
  StockMovementFindAllDto,
  StockMovementQueryDto,
  StockMovementUpdateDto,
} from '@/modules/stock-movement/dto/stock-movement.dto';
import { StockMovement } from '@/modules/stock-movement/stock-movement.entity';
import { StockMovementService } from '@/modules/stock-movement/stock-movement.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('stock-movements')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Get()
  async findAll(
    @Query() query: StockMovementQueryDto,
  ): Promise<StockMovementFindAllDto[]> {
    return this.stockMovementService.findAll(query);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() stockMovementCreateDto: StockMovementCreateDto,
  ): Promise<StockMovement> {
    return this.stockMovementService.create(stockMovementCreateDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() stockMovementUpdateDto: StockMovementUpdateDto,
  ): Promise<StockMovement> {
    return this.stockMovementService.update(id, stockMovementUpdateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.stockMovementService.delete(id);
  }
}

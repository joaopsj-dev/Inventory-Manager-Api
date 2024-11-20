import { StockMovementController } from '@/modules/stock-movement/stock-movement.controller';
import { StockMovementRepository } from '@/modules/stock-movement/stock-movement.repository';
import { StockMovementService } from '@/modules/stock-movement/stock-movement.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovementRepository])],
  providers: [StockMovementService],
  controllers: [StockMovementController],
  exports: [StockMovementService],
})
export class StockMovementModule {}

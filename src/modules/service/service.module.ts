import { ServiceController } from '@/modules/service/service.controller';
import { ServiceRepository } from '@/modules/service/service.repository';
import { ServiceService } from '@/modules/service/service.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRepository])],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}

import { ServiceController } from '@/modules/service/service.controller';
import { ServiceRepository } from '@/modules/service/service.repository';
import { ServiceService } from '@/modules/service/service.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../customer/customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRepository, CustomerRepository])],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}

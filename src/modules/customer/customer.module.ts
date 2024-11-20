import { CustomerController } from '@/modules/customer/customer.controller';
import { CustomerRepository } from '@/modules/customer/customer.repository';
import { CustomerService } from '@/modules/customer/customer.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerRepository])],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}

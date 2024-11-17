import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CustomerCreateDto,
  CustomerFindAllDto,
  CustomerFindOneDto,
  CustomerUpdateDto,
} from 'src/modules/customer/dto/customer.dto';
import { Customer } from './customer.entity';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async findAll(
    name?: string,
    contact?: string,
  ): Promise<CustomerFindAllDto[]> {
    return this.customerRepository.findAllWithServiceCount(name, contact);
  }

  async findOne(
    id: string,
    device?: string,
    status?: string,
    defect?: string,
  ): Promise<CustomerFindOneDto> {
    const customer = await this.customerRepository.findOneCustomer(
      id,
      device,
      status,
      defect,
    );

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async create(customer: CustomerCreateDto): Promise<Customer> {
    return await this.customerRepository.createCustomer(customer);
  }

  async update(id: string, customer: CustomerUpdateDto): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne(id);

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return await this.customerRepository.create(customer);
  }

  async delete(id: string): Promise<void> {
    const result = await this.customerRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }
}

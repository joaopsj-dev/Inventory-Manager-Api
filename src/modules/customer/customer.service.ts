import { Customer } from '@/modules/customer/customer.entity';
import { CustomerRepository } from '@/modules/customer/customer.repository';
import {
  CustomerCreateDto,
  CustomerFindAllDto,
  CustomerFindOneDto,
  CustomerUpdateDto,
} from '@/modules/customer/dto/customer.dto';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

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
    const existingCustomer = await this.customerRepository.findOne({
          where: { contact: customer.contact },
        });
    
        if (existingCustomer) {
          throw new UnprocessableEntityException('User already exists');
        }
    
        try {
          return await this.customerRepository.createCustomer(customer);
        } catch (error) {
          throw new UnprocessableEntityException(error.message);
        }
  }

  async update(id: string, customer: CustomerUpdateDto): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne(id);

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const existingCustomerWithContact = await this.customerRepository.findOne({
      where: { contact: customer.contact },
    });

    if (existingCustomerWithContact && existingCustomerWithContact.id !== id) {
      throw new UnprocessableEntityException('Contact already in use');
    }

    return await this.customerRepository.updateCustomer(id, customer);
  }

  async delete(id: string): Promise<void> {
    const result = await this.customerRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }
}

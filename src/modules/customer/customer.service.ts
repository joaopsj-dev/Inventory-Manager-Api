import { Customer } from '@/modules/customer/customer.entity';
import { CustomerRepository } from '@/modules/customer/customer.repository';
import {
  CustomerBaseDto,
  CustomerCreateDto,
  CustomerFindAllDto,
  CustomerUpdateDto,
  GetUserDto,
} from '@/modules/customer/dto/customer.dto';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async findAll(name?: string): Promise<CustomerFindAllDto[]> {
    return this.customerRepository.findAllWithServiceCount(name);
  }

  async findByContact(contact: string): Promise<CustomerBaseDto> {
    const customer = await this.customerRepository.findByContact(contact);

    if (!customer) {
      throw new NotFoundException(`Customer with contact ${contact} not found`);
    }

    return customer;
  }

  async findOne({ id, name, contact }: GetUserDto): Promise<CustomerBaseDto> {
    const customer = await this.customerRepository.findOneCustomer(
      id,
      name,
      contact,
    );

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    return customer;
  }

  async create(customer: CustomerCreateDto): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { contact: customer.contact },
    });

    if (existingCustomer) {
      throw new UnprocessableEntityException('Contato já cadastrado');
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
      throw new UnprocessableEntityException('Contato já cadastrado');
    }

    return await this.customerRepository.updateCustomer(id, customer);
  }

  async delete(id: string): Promise<void> {
    const existingCustomer = await this.customerRepository.findOne(id);

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    await this.customerRepository.delete(id);
  }
}

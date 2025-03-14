import { Customer } from '@/modules/customer/customer.entity';
import {
  CustomerBaseDto,
  CustomerCreateDto,
  CustomerFindAllDto,
  CustomerUpdateDto,
} from '@/modules/customer/dto/customer.dto';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async createCustomer(customer: CustomerCreateDto): Promise<Customer> {
    const newCustomer = await this.create(customer);
    return await this.save(newCustomer);
  }

  async updateCustomer(
    id: string,
    customer: CustomerUpdateDto,
  ): Promise<Customer> {
    const updateCustomer = this.create(customer);

    await this.save({ ...updateCustomer, id });

    return await this.findOne(id);
  }

  async findAllWithServiceCount(name?: string): Promise<CustomerFindAllDto[]> {
    const query = this.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.services', 'service')
      .loadRelationCountAndMap('customer.serviceCount', 'customer.services');

    if (name) {
      query.andWhere('customer.name ILIKE :name', { name: `%${name}%` });
    }

    const customers = await query.getMany();

    return customers.map((customer) => {
      const customerDto: CustomerFindAllDto = {
        id: customer.id,
        name: customer.name,
        contact: customer.contact,
        updatedAt: customer.updatedAt,
        createdAt: customer.createdAt,
        services: customer.services,
        servicesCount: customer.services.length,
      };
      return customerDto;
    });
  }

  async findByContact(contact: string): Promise<CustomerBaseDto | undefined> {
    const customer = await this.findOne({ where: { contact } });

    if (!customer) {
      return undefined;
    }

    const customerDto: CustomerBaseDto = {
      id: customer.id,
      name: customer.name,
      contact: customer.contact,
      updatedAt: customer.updatedAt,
      createdAt: customer.createdAt,
    };

    return customerDto;
  }

  async findOneCustomer(
    id?: string,
    name?: string,
    contact?: string,
  ): Promise<CustomerBaseDto | undefined> {
    if (!id && !name && !contact) {
      return undefined;
    }

    const query = this.createQueryBuilder('customer');

    if (id) {
      query.where('customer.id = :id', { id });
    } else if (name) {
      query.where('customer.name = :name', { name });
    } else if (contact) {
      query.where('customer.contact = :contact', { contact });
    }

    const result = await query.getOne();

    if (!result) {
      return undefined;
    }

    const customerDto: CustomerBaseDto = {
      id: result.id,
      name: result.name,
      contact: result.contact,
      updatedAt: result.updatedAt,
      createdAt: result.createdAt,
    };

    return customerDto;
  }

  async delete(id: string): Promise<DeleteResult> {
    const customer = await this.findOne(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return await this.createQueryBuilder('customer')
      .delete()
      .from(Customer)
      .where('id = :id', { id })
      .execute();
  }
}

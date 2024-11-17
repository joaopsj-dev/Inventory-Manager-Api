import { Customer } from '@/modules/customer/customer.entity';
import {
  CustomerCreateDto,
  CustomerFindAllDto,
  CustomerFindOneDto,
  CustomerUpdateDto,
} from '@/modules/customer/dto/customer.dto';
import { ServiceStatus } from '@/types/enums/service-status.enum';
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

  async findAllWithServiceCount(
    name?: string,
    contact?: string,
  ): Promise<CustomerFindAllDto[]> {
    const query = this.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.services', 'service')
      .loadRelationCountAndMap('customer.serviceCount', 'customer.services');

    if (name) {
      query.andWhere('customer.name LIKE :name', { name: `%${name}%` });
    }

    if (contact) {
      query.andWhere('customer.contact LIKE :contact', {
        contact: `%${contact}%`,
      });
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

  async findOneCustomer(
    id: string,
    device?: string,
    status?: string,
    defect?: string,
  ): Promise<CustomerFindOneDto | undefined> {
    const customer = await this.findOne(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const query = this.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.services', 'service')
      .where('customer.id = :id', { id });

    if (device) {
      query.andWhere('service.device LIKE :device', { device: `%${device}%` });
    }

    if (status) {
      query.andWhere('service.status = :status', { status });
    }

    if (defect) {
      query.andWhere('service.defect LIKE :defect', { defect: `%${defect}%` });
    }

    const result = await query.getOne();

    if (!result) {
      return undefined;
    }

    const completedCount = result.services.filter(
      (service) => service.status === ServiceStatus.COMPLETED,
    ).length;
    const pendingCount = result.services.filter(
      (service) => service.status === ServiceStatus.IN_PROGRES,
    ).length;

    const customerDto: CustomerFindOneDto = {
      id: result.id,
      name: result.name,
      contact: result.contact,
      updatedAt: result.updatedAt,
      createdAt: result.createdAt,
      services: result.services,
      completedCount,
      pendingCount,
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

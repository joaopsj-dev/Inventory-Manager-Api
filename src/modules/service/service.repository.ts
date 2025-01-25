import { DeleteResult, EntityRepository, Repository } from 'typeorm';

import {
  ServiceCreateDto,
  ServiceFindAllDto,
  ServiceUpdateDto,
} from '@/modules/service/dto/service.dto';
import { Service } from '@/modules/service/service.entity';
import { ServiceStatus } from '@/types/enums/service-status.enum';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async createService(service: ServiceCreateDto): Promise<Service> {
    const newService = this.create(service);
    return await this.save(newService);
  }

  async updateService(id: string, service: ServiceUpdateDto): Promise<Service> {
    const updateService = this.create(service);
    await this.save({ ...updateService, id });
    return await this.findOne(id);
  }

  async findAllServices(
    customer?: string,
    contact?: string,
    deviceName?: string,
    serviceStatus?: ServiceStatus,
  ): Promise<ServiceFindAllDto[]> {
    const query = this.createQueryBuilder('service')
      .leftJoinAndSelect('service.customer', 'customer')
      .leftJoinAndSelect('service.user', 'user');

    if (customer) {
      query.andWhere('customer.name LIKE :customer', {
        customer: `%${customer}%`,
      });
    }

    if (contact) {
      query.andWhere('customer.contact LIKE :contact', {
        contact: `%${contact}%`,
      });
    }

    if (deviceName) {
      query.andWhere('service.device LIKE :deviceName', {
        deviceName: `%${deviceName}%`,
      });
    }

    if (serviceStatus) {
      query.andWhere('service.status = :serviceStatus', { serviceStatus });
    }

    const services = await query.getMany();

    return services.map((service) => {
      const serviceDto: ServiceFindAllDto = {
        id: service.id,
        customerId: service.customerId,
        userId: service.userId,
        device: service.device,
        defect: service.defect,
        value: service.value,
        remainingValue: service.remainingValue,
        isPaid: service.isPaid,
        advanceValue: service.advanceValue,
        status: service.status,
        receivedAt: service.receivedAt,
        deliveryDate: service.deliveryDate,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        customer: service.customer,
        user: service.user,
      };
      return serviceDto;
    });
  }

  async deleteService(id: string): Promise<DeleteResult> {
    const service = await this.findOne(id);

    if (!service) {
      throw new Error('Service not found');
    }

    return await this.createQueryBuilder('service')
      .delete()
      .from(Service)
      .where('id = :id', { id })
      .execute();
  }

  async finishService(id: string): Promise<Service> {
    const service = await this.findOne(id);

    if (!service) {
      throw new Error('Service not found');
    }

    service.remainingValue = 0;
    service.isPaid = true;
    service.status = ServiceStatus.COMPLETED;

    await this.save(service);

    return service;
  }
}

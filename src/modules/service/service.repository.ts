import { DeleteResult, EntityRepository, Repository } from 'typeorm';

import {
  ServiceCreateDto,
  ServiceFindAllDto,
  ServiceUpdateDto,
} from '@/modules/service/dto/service.dto';
import { Service } from '@/modules/service/service.entity';
import { ServiceStatus } from '@/types/enums/service-status.enum';
import { DateUtil } from '@/utils/date.util';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async createService({
    receivedAt,
    deliveryDate,
    ...rest
  }: ServiceCreateDto): Promise<Service> {
    const newService = this.create({
      ...rest,
      receivedAt: DateUtil.adjustTimezone(receivedAt, 3).toISOString(),
      deliveryDate: deliveryDate
        ? DateUtil.adjustTimezone(deliveryDate, 3).toISOString()
        : null,
    });
    return await this.save(newService);
  }

  async updateService(
    id: string,
    { receivedAt, deliveryDate, ...rest }: ServiceUpdateDto,
  ): Promise<Service> {
    const updateService = this.create({
      ...rest,
      receivedAt: receivedAt
        ? DateUtil.adjustTimezone(receivedAt, 3).toISOString()
        : null,
      deliveryDate: deliveryDate
        ? DateUtil.adjustTimezone(deliveryDate, 3).toISOString()
        : null,
    });
    await this.save({ ...updateService, id });
    return await this.findOne(id);
  }

  async findAllServices(clientName?: string): Promise<ServiceFindAllDto[]> {
    const query = this.createQueryBuilder('service')
      .leftJoinAndSelect('service.customer', 'customer')
      .leftJoinAndSelect('service.user', 'user');

    if (clientName) {
      query.andWhere('customer.name ILIKE :clientName', {
        clientName: `%${clientName}%`,
      });
    }

    const services = await query.getMany();

    return services.map((service) => {
      const serviceDto: ServiceFindAllDto = {
        id: service.id,
        clientName: service.customer.name,
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

import {
  ServiceCreateDto,
  ServiceFindAllDto,
  ServiceQueryDto,
  ServiceUpdateDto,
} from '@/modules/service/dto/service.dto';
import { Service } from '@/modules/service/service.entity';
import { ServiceRepository } from '@/modules/service/service.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from '../customer/customer.repository';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceRepository)
    @InjectRepository(CustomerRepository)
    private serviceRepository: ServiceRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async create(serviceCreateDto: ServiceCreateDto): Promise<Service> {
    const customer = await this.customerRepository.findOne(
      serviceCreateDto.customerId,
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const service: ServiceCreateDto & { isPaid: boolean } = {
      ...serviceCreateDto,
      isPaid: serviceCreateDto.paymentStatus === 'TOTAL',
      advanceValue:
        serviceCreateDto.paymentStatus === 'TOTAL'
          ? serviceCreateDto.value
          : serviceCreateDto.advanceValue,
    };

    return await this.serviceRepository.createService(service);
  }

  async update(
    id: string,
    serviceUpdateDto: ServiceUpdateDto,
  ): Promise<Service> {
    const existingService = await this.serviceRepository.findOne(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const service: ServiceUpdateDto & { isPaid: boolean } = {
      ...serviceUpdateDto,
      isPaid: serviceUpdateDto.paymentStatus === 'TOTAL',
      advanceValue:
        serviceUpdateDto.paymentStatus === 'TOTAL'
          ? serviceUpdateDto.value
          : serviceUpdateDto.advanceValue,
    };

    return await this.serviceRepository.updateService(id, service);
  }

  async findAll({
    clientName,
    firstDate,
    lastDate,
  }: ServiceQueryDto): Promise<ServiceFindAllDto[]> {
    return await this.serviceRepository.findAllServices(
      clientName,
      firstDate,
      lastDate,
    );
  }

  async delete(id: string): Promise<void> {
    const existingService = await this.serviceRepository.findOne(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    await this.serviceRepository.deleteService(id);
  }

  async finishService(id: string): Promise<Service> {
    const existingService = await this.serviceRepository.findOne(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return await this.serviceRepository.finishService(id);
  }
}

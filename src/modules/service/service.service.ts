import {
  ServiceCreateDto,
  ServiceFindAllDto,
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

    return await this.serviceRepository.createService(serviceCreateDto);
  }

  async update(
    id: string,
    serviceUpdateDto: ServiceUpdateDto,
  ): Promise<Service> {
    const existingService = await this.serviceRepository.findOne(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return await this.serviceRepository.updateService(id, serviceUpdateDto);
  }

  async findAll(clientName?: string): Promise<ServiceFindAllDto[]> {
    return await this.serviceRepository.findAllServices(clientName);
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRepository } from './service.repository';
import { Service } from './service.entity';
import { ServiceStatus } from '@/types/enums/service-status.enum';
import {
  ServiceCreateDto,
  ServiceUpdateDto,
  ServiceFindAllDto,
} from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async create(serviceCreateDto: ServiceCreateDto): Promise<Service> {
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

  async findAll(
    customer?: string,
    contact?: string,
    deviceName?: string,
    serviceStatus?: ServiceStatus,
  ): Promise<ServiceFindAllDto[]> {
    return await this.serviceRepository.findAllServices(
      customer,
      contact,
      deviceName,
      serviceStatus,
    );
  }

  async delete(id: string): Promise<void> {
    const result = await this.serviceRepository.deleteService(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }

  async finishService(id: string): Promise<Service> {
    const existingService = await this.serviceRepository.findOne(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return await this.serviceRepository.finishService(id);
  }
}

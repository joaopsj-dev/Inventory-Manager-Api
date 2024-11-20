import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import {
  ServiceCreateDto,
  ServiceFindAllDto,
  ServiceUpdateDto,
} from '@/modules/service/dto/service.dto';
import { ServiceService } from '@/modules/service/service.service';
import { ServiceStatus } from '@/types/enums/service-status.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('service')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAllServices(
    @Query('customer') customer?: string,
    @Query('contact') contact?: string,
    @Query('deviceName') deviceName?: string,
    @Query('serviceStatus') serviceStatus?: ServiceStatus,
  ): Promise<ServiceFindAllDto[]> {
    return await this.serviceService.findAll(
      customer,
      contact,
      deviceName,
      serviceStatus,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async createService(@Body() serviceCreateDto: ServiceCreateDto) {
    return await this.serviceService.create(serviceCreateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  public async updateService(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() serviceUpdateDto: ServiceUpdateDto,
  ) {
    return await this.serviceService.update(id, serviceUpdateDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteService(@Param('id', ParseUUIDPipe) id: string) {
    await this.serviceService.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id/finish')
  public async finishService(@Param('id', ParseUUIDPipe) id: string) {
    return await this.serviceService.finishService(id);
  }
}

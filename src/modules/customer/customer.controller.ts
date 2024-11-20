import { CustomerService } from '@/modules/customer/customer.service';
import {
  CustomerCreateDto,
  CustomerQueryDto,
  CustomerUpdateDto,
} from '@/modules/customer/dto/customer.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAllCustomers() {
    return await this.customerService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public async getUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: CustomerQueryDto,
  ) {
    return await this.customerService.findOne(
      id,
      query.defect,
      query.device,
      query.status,
    );
  }

  public async createCustomer(@Body() createBodyDto: CustomerCreateDto) {
    return await this.customerService.create(createBodyDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  public async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() customerUpdatebody: CustomerUpdateDto,
  ) {
    return await this.customerService.update(id, customerUpdatebody);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteCustomer(@Param('id', ParseUUIDPipe) id: string) {
    await this.customerService.delete(id);
  }
}

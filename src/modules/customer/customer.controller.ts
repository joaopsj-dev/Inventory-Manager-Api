import { CustomerService } from '@/modules/customer/customer.service';
import {
  CustomerCreateDto,
  CustomerFindAllDto,
  CustomerUpdateDto,
  GetUserDto,
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
  Post,
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
  public async getAllCustomers(
    @Query('name') name?: string,
  ): Promise<CustomerFindAllDto[]> {
    return await this.customerService.findAll(name);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/contact/:contact')
  public async findByContact(@Param('contact') contact: string) {
    return await this.customerService.findByContact(contact);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/param')
  public async getUser(@Query() query: GetUserDto) {
    return await this.customerService.findOne(query);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
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

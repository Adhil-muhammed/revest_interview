import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  GetProductRequest, 
  GetProductsRequest 
} from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.productService.updateStock(id, body.quantity);
  }

  // gRPC Methods
  @GrpcMethod('ProductService', 'GetProduct')
  getProduct(data: GetProductRequest) {
    return this.productService.getProduct(data);
  }

  @GrpcMethod('ProductService', 'GetProducts')
  getProducts(data: GetProductsRequest) {
    return this.productService.getProducts(data);
  }
}

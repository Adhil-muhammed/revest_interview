import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderController } from './order.controller';
import { OrderGrpcController } from './order-grpc.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../proto/product.proto'),
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [OrderController, OrderGrpcController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}

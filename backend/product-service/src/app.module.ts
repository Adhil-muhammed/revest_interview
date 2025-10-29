import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:password123@localhost:27017/revest_db?authSource=admin'),
    ProductModule,
  ],
})
export class AppModule {}

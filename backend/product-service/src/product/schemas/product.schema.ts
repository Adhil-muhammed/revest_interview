import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop({ default: true })
  inStock: boolean;

  @Prop()
  imageUrl: string;

  @Prop()
  sku: string;

  @Prop({ default: 0 })
  stockQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

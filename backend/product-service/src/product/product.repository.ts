import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/entity.repository';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductRepository extends EntityRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  // Product-specific repository methods
  async findByCategory(category: string): Promise<ProductDocument[]> {
    return this.productModel.find({ category }).exec();
  }

  async findInStock(): Promise<ProductDocument[]> {
    return this.productModel.find({ inStock: true }).exec();
  }

  async findOutOfStock(): Promise<ProductDocument[]> {
    return this.productModel.find({ inStock: false }).exec();
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<ProductDocument[]> {
    return this.productModel.find({
      price: { $gte: minPrice, $lte: maxPrice }
    }).exec();
  }

  async findBySku(sku: string): Promise<ProductDocument | null> {
    return this.productModel.findOne({ sku }).exec();
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument | null> {
    return this.productModel.findByIdAndUpdate(
      id,
      {
        $inc: { stockQuantity: -quantity },
        $set: { inStock: true }
      },
      { new: true }
    ).exec();
  }

  async searchProducts(searchTerm: string): Promise<ProductDocument[]> {
    return this.productModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
      ]
    }).exec();
  }

  async getProductStats(): Promise<any> {
    return this.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          inStockProducts: {
            $sum: { $cond: [{ $eq: ['$inStock', true] }, 1, 0] }
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $eq: ['$inStock', false] }, 1, 0] }
          },
          averagePrice: { $avg: '$price' },
          totalStockQuantity: { $sum: '$stockQuantity' }
        }
      }
    ]);
  }
}

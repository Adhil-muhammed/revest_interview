import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/entity.repository';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';

@Injectable()
export class OrderRepository extends EntityRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }

  // Order-specific repository methods
  async findByCustomer(customerName: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ customerName }).exec();
  }

  async findByCustomerEmail(customerEmail: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ customerEmail }).exec();
  }

  async findByStatus(status: OrderStatus): Promise<OrderDocument[]> {
    return this.orderModel.find({ status }).exec();
  }

  async findByProduct(productId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ productId }).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<OrderDocument[]> {
    return this.orderModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
  }

  async findPendingOrders(): Promise<OrderDocument[]> {
    return this.orderModel.find({ status: OrderStatus.PENDING }).exec();
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDocument | null> {
    return this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();
  }

  async getTotalOrderAmount(customerEmail?: string): Promise<number> {
    const matchStage: any = {};
    if (customerEmail) {
      matchStage.customerEmail = customerEmail;
    }

    const result = await this.aggregate<{ _id: null; total: number }>([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getOrderStats(): Promise<any> {
    return this.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);
  }

  async getTopCustomers(limit: number = 10): Promise<any> {
    return this.aggregate([
      {
        $group: {
          _id: '$customerEmail',
          customerName: { $first: '$customerName' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit }
    ]);
  }

  async getRecentOrders(limit: number = 20): Promise<OrderDocument[]> {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}

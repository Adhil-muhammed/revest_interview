import { Document, FilterQuery, Model, PipelineStage, Types, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) { }

  async findOne(entityFilterQuery: FilterQuery<T>, projection?: Record<string, unknown>): Promise<T | null> {
    return this.entityModel
      .findOne(entityFilterQuery, {
        __v: 0,
        ...projection,
      })
      .exec();
  }

  async find(entityFilterQuery: FilterQuery<T>, ...populate: string[]): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery).populate(populate);
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    const savedEntity = await entity.save();
    return savedEntity as T;
  }
  
  async insertMany(createEntityData: unknown[]): Promise<T[]> {
    const savedEntity = await this.entityModel.insertMany(createEntityData);
    return savedEntity as T[];
  }
  
  async updateMany(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<unknown>): Promise<boolean> {
    const updateResult = await this.entityModel.updateMany(entityFilterQuery, updateEntityData);
    return updateResult.modifiedCount >= 1;
  }
  
  async countDocuments(entityFilterQuery: FilterQuery<T>): Promise<number> {
    return this.entityModel.countDocuments(entityFilterQuery);
  }

  async findOneAndUpdate(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<unknown>): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, {
      new: true,
    });
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteOne({ _id: id });
    return deleteResult.deletedCount >= 1;
  }

  async aggregate<K>(pipeline: PipelineStage[]): Promise<K[]> {
    return this.entityModel.aggregate<K>(pipeline);
  }

  // Additional common methods
  async findById(id: string | Types.ObjectId): Promise<T | null> {
    return this.entityModel.findById(id).exec();
  }

  async findByIds(ids: (string | Types.ObjectId)[]): Promise<T[]> {
    return this.entityModel.find({ _id: { $in: ids } }).exec();
  }

  async updateById(id: string | Types.ObjectId, updateEntityData: UpdateQuery<unknown>): Promise<T | null> {
    return this.entityModel.findByIdAndUpdate(id, updateEntityData, { new: true }).exec();
  }

  async exists(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const count = await this.entityModel.countDocuments(entityFilterQuery);
    return count > 0;
  }

  async findAll(): Promise<T[]> {
    return this.entityModel.find().exec();
  }
}

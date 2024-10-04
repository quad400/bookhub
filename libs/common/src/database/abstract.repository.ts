import { ConflictException, NotFoundException } from '@nestjs/common';
import { Connection, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { v4 as uuidV4 } from 'uuid';
import { QueryDto } from '../global';
import { RpcException } from '@nestjs/microservices';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  // Unique check method
  async checkUnique(
    data: Record<string, any>,
    uniqueField: string,
  ): Promise<boolean> {
    const entity = await this.model.findOne({
      [uniqueField]: data[uniqueField],
      is_deleted: false,
    });

    if (entity) {
      
      throw new ConflictException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(
            0,
            -1,
          )} with ${uniqueField} "${data[uniqueField]}" already exists.`,
      );
    }
    return true;
  }

  async create(document: Record<string, any>): Promise<any>{
    const createdDocument = new this.model({
      ...document,
      _id: uuidV4(),
    });
    return await createdDocument.save();
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    disableCheck = false,
  ): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery, {
        is_deleted: false,
      })
      .select('-password');

    if (!document && !disableCheck) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }

    return document;
  }

  async findById(id: string): Promise<TDocument> {
    const document = await this.model
      .findOne({ _id: id, is_deleted: false })
      .select('-password');

    if (!document) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }
    return document;
  }



  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(
      { ...filterQuery, is_deleted: false },
      update,
      {
        new: true,
      },
    );

    if (!document) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }

    return document;
  }

  async find({ filterQuery }: { filterQuery?: FilterQuery<TDocument> }): Promise<TDocument[]> {
    const items = await this.model.find({ ...filterQuery, is_deleted: false });
    return items;
  }

  async findPaginated({
    query,
    filterQuery,
  }: {
    query: QueryDto;
    filterQuery?: FilterQuery<TDocument>;
  }): Promise<any> {
    const { limit, page, searchField, searchValue, sortDirection, sortField } =
      query;
    const skip = (page - 1) * limit;

    const filter = { is_deleted: false };

    // Construct the sorting object
    const sortFilter: Record<string, 1 | -1> = sortField
      ? { [sortField]: sortDirection === 'DESC' ? -1 : 1 }
      : { created_at: 1 };

    // If a search query is provided, apply text search or regex search
    if (searchField && searchValue) {
      filter[searchField] = { $regex: searchValue, $options: 'i' }; // Case-insensitive regex search
    }

    // Find the documents with pagination, filtering, and sorting
    const items = await this.model
      .find({ ...filter, ...filterQuery })
      .sort(sortFilter)
      .skip(skip)
      .limit(limit)
      .exec();

    // Count the total number of documents for pagination metadata
    const totalItems = await this.model
      .countDocuments({ ...filter, ...filterQuery })
      .exec();

    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      totalItems,
      totalPages,
      currentPage: page,
      hasPreviousPage,
      hasNextPage,
      items,
    };
  }

  async delete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOneAndDelete(filterQuery);

    if (!document) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }
  }

  async softDelete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOneAndUpdate(
      filterQuery,
      { is_deleted: true },
      {
        new: true,
      },
    );

    if (!document) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }

    return document;
  }

  async restore(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOneAndUpdate(
      { ...filterQuery, is_deleted: true },
      { is_deleted: false },
      {
        new: true,
      },
    );

    if (!document) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }

    return document;
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}

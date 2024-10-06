import { AbstractRepository, Hub, QueryDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model } from 'mongoose';

@Injectable()
export class HubRepository extends AbstractRepository<Hub> {
  constructor(
    @InjectModel(Hub.name) hubModel: Model<Hub>,
    @InjectConnection() connection: Connection,
  ) {
    super(hubModel, connection);
  }

  
  async findPaginated({
    query,
    filterQuery,
  }: {
    query: QueryDto;
    filterQuery?: FilterQuery<Hub>;
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
      .populate("hub_profile")
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
}

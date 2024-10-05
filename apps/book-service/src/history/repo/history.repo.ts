import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';
import { AbstractRepository, History, QueryDto } from '@app/common';

@Injectable()
export class HistoryRepository extends AbstractRepository<History> {
  protected readonly logger = new Logger(HistoryRepository.name);

  constructor(
    @InjectModel(History.name) historyModel: Model<History>,
    @InjectConnection() connection: Connection,
  ) {
    super(historyModel, connection);
  }

  async findPaginated({
    query,
    filterQuery,
  }: {
    query: QueryDto;
    filterQuery?: FilterQuery<History>;
  }): Promise<{
    items: History[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
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
      .populate({
        path: 'borrower',
        select: 'username email profile',
      })
      .populate({
        path: 'book',
        select:
          'title book_cover author synopsis isbn genre shareable achieved',
      })
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

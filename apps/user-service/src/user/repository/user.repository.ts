import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { User, UserDocument } from '../../../../../libs/common/src/database/models/user.model';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }

  async findOne(
    filterQuery: FilterQuery<User>,
  ): Promise<User> {
    const document = await this.model
      .findOne(filterQuery, { is_deleted: false })
      .select('password');

    if (!document) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }

    return document;
  }
}

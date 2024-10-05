import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { Profile, ProfileDocument } from '../../../../../libs/common/src/database/models/profile.model';

@Injectable()
export class ProfileRepository extends AbstractRepository<Profile> {
  protected readonly logger = new Logger(ProfileRepository.name);

  constructor(
    @InjectModel(Profile.name) profileModel: Model<ProfileDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(profileModel, connection);
  }
}

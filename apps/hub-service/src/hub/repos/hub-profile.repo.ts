import { AbstractRepository, HubProfile } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class HubProfileRepository extends AbstractRepository<HubProfile> {
  constructor(
    @InjectModel(HubProfile.name) hubProfileModel: Model<HubProfile>,
    @InjectConnection() connection: Connection,
  ) {
    super(hubProfileModel, connection);
  }
}

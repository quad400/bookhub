import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { Token, TokenDocument } from '../model/token.model';

@Injectable()
export class TokenRepository extends AbstractRepository<Token> {
  protected readonly logger = new Logger(TokenRepository.name);

  constructor(
    @InjectModel(Token.name) tokenModel: Model<TokenDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(tokenModel, connection);
  }
}

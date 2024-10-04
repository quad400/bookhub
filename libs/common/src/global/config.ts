import { IsString } from 'class-validator';
import { configDotenv } from 'dotenv';

configDotenv();

class Configure {
  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET;

  @IsString()
  readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
}

export const Config = new Configure()

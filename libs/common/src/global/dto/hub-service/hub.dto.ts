import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateHubDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateHubDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

export class MemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  memberId: string;
}

export class HubPermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty()
  @IsEnum({ ADMIN: 'ADMIN', USER: 'USER' })
  @IsNotEmpty()
  role: 'USER' | 'ADMIN';
}

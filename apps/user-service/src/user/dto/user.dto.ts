import { UserRole } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  fullname?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location?: string;
}


export class UpdateSocketConnectionDto{

  @IsBoolean()
  @IsNotEmpty()
  is_online: boolean
  
  @IsString()
  @IsNotEmpty()
  socket_id: string
}
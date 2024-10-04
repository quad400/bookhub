import { PartialType } from '@nestjs/mapped-types';
import { BookEnum } from '@app/common/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  book_cover: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty()
  @IsEnum(BookEnum)
  @IsNotEmpty()
  genre: string;
}


export class UpdateBookDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  @IsNotEmpty()
  book_cover?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  synopsis?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  isbn?: string;


  @ApiProperty()
  @IsOptional()
  @IsEnum(BookEnum)
  @IsNotEmpty()
  genre?: string;
}

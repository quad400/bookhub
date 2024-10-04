import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsEnum({ ASC: 'ASC', DESC: 'DESC' })
  sortDirection?: 'ASC' | 'DESC';

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  searchField?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  searchValue?: string;
}

export class QueryWithoutSearchDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsEnum({ ASC: 'ASC', DESC: 'DESC' })
  sortDirection?: 'ASC' | 'DESC';

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortField?: string;

}

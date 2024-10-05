import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class AddFeedbackDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Max(5)
  @Min(1)
  rate: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
  
  @ApiProperty()
  @IsUUID()
  bookId: string;
}


export class UpdateFeedbackDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Max(5)
  @Min(1)
  rate: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
}
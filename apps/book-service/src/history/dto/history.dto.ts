import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ApproveReturnedBookDto{

    @ApiProperty()
    @IsString()
    @IsOptional()
    condition?: string
}
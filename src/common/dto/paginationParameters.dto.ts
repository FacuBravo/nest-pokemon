import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationParametes {

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Min(1)
    limit: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    offset: number;
}
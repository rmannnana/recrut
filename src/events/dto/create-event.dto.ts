import { IsString, IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateEventDto {
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDateString()
    date!: string;

    @IsString()
    location!: string;

    @IsInt()
    @Min(1)
    capacity!: number;
}
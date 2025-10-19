import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProgressDto {
    @IsNumber()
    @IsNotEmpty()
    resourceId: number

    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsOptional()
    @IsNumber()
    completion: number

    @IsDateString()
    lastReviewed: Date

    @IsOptional()
    @IsNumber()
    confidence: number

    @IsString()
    @IsOptional()
    notes: string
}
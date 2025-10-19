import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ResourceType } from '../interface/resource.interface';

export class CreateResourceDto {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsEnum(ResourceType)
  @IsOptional()
  type: ResourceType;

  @IsOptional()
  @IsString()
  content: string;
}

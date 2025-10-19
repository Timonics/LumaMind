import { Controller, Get, Param, Post } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { Resource } from './interface/resource.interface';
import { CreateResourceDto } from './dto/create-resource.dto';

@Controller(`resources`)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async findAll(): Promise<Resource[]> {
    return await this.resourceService.findAll();
  }

  @Get('resource/:id')
  async findOne(@Param('id') id: number): Promise<Resource | null> {
    return await this.resourceService.findOne(id);
  }

  @Post()
  async create(createResourceData: CreateResourceDto) {
    return await this.resourceService.create(createResourceData)
  }
}
